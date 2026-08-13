// scripts/note-x-autopost.mjs
// note.com の RSS フィードを定期チェックし、新着記事を X（旧Twitter）に自動投稿する。
// GitHub Actions (cron) から実行。環境変数:
//   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
//   NOTE_USERNAME (note.com のユーザー名)
//   LAST_CHECK_FILE (前回チェック日時を保存するパス、省略時はキャッシュファイル使用)

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const NOTE_USERNAME = process.env.NOTE_USERNAME || 'sane_design2026';
const NOTE_RSS_URL = `https://note.com/${NOTE_USERNAME}/rss`;
const SITE = 'https://sane-design.net';
const X_API_URL = 'https://api.twitter.com/2/tweets';
const TWEET_LIMIT = 270;

const {
  X_API_KEY, X_API_SECRET,
  X_ACCESS_TOKEN, X_ACCESS_SECRET,
} = process.env;

// 前回チェック日時の保存先（GitHub Actions の cache で永続化）
const LAST_CHECK_FILE = process.env.LAST_CHECK_FILE
  || path.join(process.cwd(), '.note-last-check');

const log = (...a) => console.log('[note-x-autopost]', ...a);
const err = (...a) => console.error('[note-x-autopost:ERROR]', ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── RSS パース（軽量XML→記事リスト） ───

function parseRSSItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</${tag}>`));
      return m ? m[1].trim() : '';
    };
    items.push({
      title: get('title'),
      link: get('link'),
      description: get('description'),
      pubDate: get('pubDate'),
    });
  }
  return items;
}

// ─── OAuth 1.0a 署名生成（x-autopost.mjs と同一） ───

function percentEncode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21').replace(/\*/g, '%2A')
    .replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

function generateSignature(method, url, params, consumerSecret, tokenSecret) {
  const sortedParams = Object.keys(params).sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`).join('&');
  const baseString = [method.toUpperCase(), percentEncode(url), percentEncode(sortedParams)].join('&');
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
}

function buildAuthHeader(method, url) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce();
  const oauthParams = {
    oauth_consumer_key: X_API_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: X_ACCESS_TOKEN,
    oauth_version: '1.0',
  };
  const signature = generateSignature(method, url, oauthParams, X_API_SECRET, X_ACCESS_SECRET);
  oauthParams.oauth_signature = signature;
  const headerParts = Object.keys(oauthParams).sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`).join(', ');
  return `OAuth ${headerParts}`;
}

// ─── ツイート作成・投稿 ───

function buildNoteTweetText(item) {
  const fixedTags = ['#note更新', '#ホームページ制作', '#SaneDesign'];
  const tagStr = fixedTags.join(' ');

  const lines = [`【note更新】${item.title}`];
  const headerLen = lines.join('\n').length;
  // URL は t.co 短縮で23文字 + 前後の改行
  const reserved = 23 + 2 + tagStr.length + 4;
  const budget = TWEET_LIMIT - headerLen - reserved;

  // description から HTML タグを除去して説明文に
  let desc = item.description
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/\s+/g, ' ')
    .trim();

  if (desc && budget > 30) {
    const trimmedDesc = desc.length > budget ? desc.slice(0, budget - 1) + '…' : desc;
    lines.push('', trimmedDesc);
  }
  lines.push('', item.link);
  lines.push('', tagStr);
  return lines.join('\n');
}

async function postTweet(text) {
  const authHeader = buildAuthHeader('POST', X_API_URL);
  const res = await fetch(X_API_URL, {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`X API ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// ─── 前回チェック日時の読み書き ───

async function getLastCheck() {
  try {
    const raw = await fs.readFile(LAST_CHECK_FILE, 'utf8');
    const d = new Date(raw.trim());
    if (!isNaN(d.getTime())) return d;
  } catch { /* ファイルなし → 初回 */ }
  // 初回は24時間前から
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

async function saveLastCheck(date) {
  await fs.writeFile(LAST_CHECK_FILE, date.toISOString(), 'utf8');
}

// ─── メイン ───

async function main() {
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    err('X API認証情報が未設定です'); process.exit(1);
  }

  // 1. note の RSS を取得
  log(`RSS取得: ${NOTE_RSS_URL}`);
  const res = await fetch(NOTE_RSS_URL);
  if (!res.ok) {
    err(`RSS取得失敗: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const xml = await res.text();
  const items = parseRSSItems(xml);
  log(`RSS記事数: ${items.length}`);

  if (items.length === 0) {
    log('記事なし。終了。');
    return;
  }

  // 2. 前回チェック日時以降の新着を抽出
  const lastCheck = await getLastCheck();
  log(`前回チェック: ${lastCheck.toISOString()}`);

  const newItems = items.filter((item) => {
    if (!item.pubDate) return false;
    const pubDate = new Date(item.pubDate);
    return pubDate > lastCheck;
  });

  if (newItems.length === 0) {
    log('新着記事なし。終了。');
    // チェック日時だけ更新
    await saveLastCheck(new Date());
    return;
  }

  log(`新着 ${newItems.length} 件を投稿します`);

  // 3. 古い順に投稿
  newItems.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

  const results = [];
  for (const item of newItems) {
    try {
      const text = buildNoteTweetText(item);
      log(`tweet text (${text.length}文字):\n${text}`);

      const result = await postTweet(text);
      const tweetId = result.data?.id;
      log(`posted: https://x.com/i/status/${tweetId}`);
      results.push({ title: item.title, ok: true, id: tweetId });
      await sleep(2000);
    } catch (e) {
      err(`${item.title}: ${e.message}`);
      results.push({ title: item.title, ok: false, error: e.message });
    }
  }

  // 4. チェック日時を更新
  await saveLastCheck(new Date());

  const failed = results.filter((r) => !r.ok);
  log(`完了: 成功 ${results.filter((r) => r.ok).length} / 失敗 ${failed.length}`);
  if (failed.length) process.exit(1);
}

main().catch((e) => { err(e.stack || e.message); process.exit(1); });
