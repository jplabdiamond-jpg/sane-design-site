// scripts/note-sns-autopost.mjs
// note.com の RSS フィードを定期チェックし、新着記事を X と Instagram の両方へ自動投稿する。
// GitHub Actions (cron) から実行。環境変数:
//   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET   … X (OAuth 1.0a)
//   IG_USER_ID, IG_ACCESS_TOKEN                                … Instagram Graph API
//   NOTE_USERNAME (note.com のユーザー名)
//   LAST_CHECK_FILE (前回チェック日時を保存するパス、省略時はキャッシュファイル使用)
//
// Instagram 画像は note の <media:thumbnail> を images.weserv.nl 経由で
// 1080x1080 正方形JPEGの公開URLに変換して使う。

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const NOTE_USERNAME = process.env.NOTE_USERNAME || 'sane_design2026';
const NOTE_RSS_URL = `https://note.com/${NOTE_USERNAME}/rss`;
const SITE = 'https://sane-design.net';
const FALLBACK_IMAGE = `${SITE}/og-image.png`;
const X_API_URL = 'https://api.twitter.com/2/tweets';
const GRAPH = 'https://graph.facebook.com/v21.0';
const TWEET_LIMIT = 270;
const CAPTION_LIMIT = 2200;

const {
  X_API_KEY, X_API_SECRET,
  X_ACCESS_TOKEN, X_ACCESS_SECRET,
  IG_USER_ID, IG_ACCESS_TOKEN,
} = process.env;

const LAST_CHECK_FILE = process.env.LAST_CHECK_FILE
  || path.join(process.cwd(), '.note-last-check');

const log = (...a) => console.log('[note-sns]', ...a);
const err = (...a) => console.error('[note-sns:ERROR]', ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clen = (s) => [...s].length;

// ─── RSS パース ───

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
      thumbnail: get('media:thumbnail'),
    });
  }
  return items;
}

// ─── OAuth 1.0a 署名生成 ───

function percentEncode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21').replace(/\*/g, '%2A')
    .replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
}
function generateNonce() { return crypto.randomBytes(16).toString('hex'); }
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

// ─── 本文整形 ───

function cleanDescription(desc) {
  return desc
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/続きをみる/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── X 投稿 ───

function buildNoteTweetText(item) {
  const fixedTags = ['#note更新', '#ホームページ制作', '#SaneDesign'];
  const tagStr = fixedTags.join(' ');
  const lines = [`【note更新】${item.title}`];
  const headerLen = lines.join('\n').length;
  const reserved = 23 + 2 + tagStr.length + 4;
  const budget = TWEET_LIMIT - headerLen - reserved;
  const desc = cleanDescription(item.description);
  if (desc && budget > 30) {
    const trimmed = desc.length > budget ? desc.slice(0, budget - 1) + '…' : desc;
    lines.push('', trimmed);
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

// ─── Instagram 投稿 ───

function toInstagramJpegUrl(srcUrl) {
  const noScheme = srcUrl.replace(/^https?:\/\//, '');
  const enc = encodeURIComponent(noScheme);
  return `https://images.weserv.nl/?url=${enc}&output=jpg&q=90&w=1080&h=1080&fit=cover&we`;
}

function buildNoteCaption(item) {
  const headerStr = `【note更新】${item.title}`;
  const footerLines = ['▼記事を読む', item.link, ''];
  const fixed = [
    '#note更新', '#ホームページ制作', '#Web制作', '#Webデザイン',
    '#フリーランスデザイナー', '#SEO対策', '#AI活用', '#SaneDesign',
  ];
  footerLines.push(fixed.join(' '));
  const footer = footerLines.join('\n');
  let bodyText = cleanDescription(item.description);
  const budget = CAPTION_LIMIT - clen(headerStr) - clen(footer) - 4;
  if (clen(bodyText) > budget) {
    bodyText = [...bodyText].slice(0, Math.max(0, budget - 1)).join('').trimEnd() + '…';
  }
  const caption = [headerStr, '', bodyText, '', footer].join('\n');
  return clen(caption) > CAPTION_LIMIT ? [...caption].slice(0, CAPTION_LIMIT).join('') : caption;
}

async function graphPost(p, params) {
  const url = `${GRAPH}/${p}`;
  const body = new URLSearchParams({ ...params, access_token: IG_ACCESS_TOKEN });
  const res = await fetch(url, { method: 'POST', body });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Graph API ${res.status}: ${JSON.stringify(json.error || json)}`);
  return json;
}

async function postInstagram(item) {
  const src = item.thumbnail && item.thumbnail.startsWith('http') ? item.thumbnail : FALLBACK_IMAGE;
  const imageUrl = toInstagramJpegUrl(src);
  const caption = buildNoteCaption(item);
  log(`ig image url: ${imageUrl}`);
  const container = await graphPost(`${IG_USER_ID}/media`, { image_url: imageUrl, caption });
  await sleep(5000);
  const published = await graphPost(`${IG_USER_ID}/media_publish`, { creation_id: container.id });
  return published.id;
}

// ─── 前回チェック日時 ───

async function getLastCheck() {
  try {
    const raw = await fs.readFile(LAST_CHECK_FILE, 'utf8');
    const d = new Date(raw.trim());
    if (!isNaN(d.getTime())) return d;
  } catch { /* 初回 */ }
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}
async function saveLastCheck(date) { await fs.writeFile(LAST_CHECK_FILE, date.toISOString(), 'utf8'); }

// ─── メイン ───

async function main() {
  const hasX = X_API_KEY && X_API_SECRET && X_ACCESS_TOKEN && X_ACCESS_SECRET;
  const hasIG = IG_USER_ID && IG_ACCESS_TOKEN;
  if (!hasX && !hasIG) { err('X / Instagram どちらの認証情報も未設定です'); process.exit(1); }
  if (!hasX) log('⚠ X 認証情報が無いため X 投稿はスキップします');
  if (!hasIG) log('⚠ Instagram 認証情報が無いため Instagram 投稿はスキップします');

  log(`RSS取得: ${NOTE_RSS_URL}`);
  const res = await fetch(NOTE_RSS_URL);
  if (!res.ok) { err(`RSS取得失敗: ${res.status} ${res.statusText}`); process.exit(1); }
  const xml = await res.text();
  const items = parseRSSItems(xml);
  log(`RSS記事数: ${items.length}`);
  if (items.length === 0) { log('記事なし。終了。'); return; }

  const lastCheck = await getLastCheck();
  log(`前回チェック: ${lastCheck.toISOString()}`);
  const newItems = items.filter((item) => {
    if (!item.pubDate) return false;
    return new Date(item.pubDate) > lastCheck;
  });
  if (newItems.length === 0) { log('新着記事なし。終了。'); await saveLastCheck(new Date()); return; }

  log(`新着 ${newItems.length} 件を投稿します`);
  newItems.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

  let anyFail = false;
  for (const item of newItems) {
    // X
    if (hasX) {
      try {
        const text = buildNoteTweetText(item);
        const r = await postTweet(text);
        log(`X posted: https://x.com/i/status/${r.data?.id} (${item.title})`);
      } catch (e) { err(`X失敗 ${item.title}: ${e.message}`); anyFail = true; }
      await sleep(2000);
    }
    // Instagram
    if (hasIG) {
      try {
        const id = await postInstagram(item);
        log(`IG posted: ${id} (${item.title})`);
      } catch (e) { err(`IG失敗 ${item.title}: ${e.message}`); anyFail = true; }
      await sleep(2000);
    }
  }

  await saveLastCheck(new Date());
  log(`完了。${anyFail ? '一部失敗あり' : '全件成功'}`);
  if (anyFail) process.exit(1);
}

main().catch((e) => { err(e.stack || e.message); process.exit(1); });
