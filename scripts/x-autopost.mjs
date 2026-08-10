// scripts/x-autopost.mjs
// 新規追加された works/*.md / blog/*.md を X（旧Twitter）に自動投稿する。
// GitHub Actions から実行。環境変数:
//   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET, CHANGED_FILES

import crypto from 'node:crypto';

const SITE = 'https://sane-design.net';
const X_API_URL = 'https://api.twitter.com/2/tweets';

const {
  X_API_KEY, X_API_SECRET,
  X_ACCESS_TOKEN, X_ACCESS_SECRET,
  CHANGED_FILES,
} = process.env;

const TWEET_LIMIT = 270;

const log = (...a) => console.log('[x-autopost]', ...a);
const err = (...a) => console.error('[x-autopost:ERROR]', ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** frontmatter を最小パース */
function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { data: {}, body: md };
  const data = {};
  let key = null;
  for (const raw of m[1].split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, '');
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      let v = kv[2].trim();
      if (v === '') { data[key] = []; continue; }
      v = v.replace(/^['"]|['"]$/g, '');
      data[key] = v;
    } else {
      const item = line.match(/^\s*-\s*(.*)$/);
      if (item && key && Array.isArray(data[key])) {
        data[key].push(item[1].replace(/^['"]|['"]$/g, ''));
      }
    }
  }
  return { data, body: md.slice(m[0].length) };
}

/** 本文からリード文を抽出 */
function extractLead(body) {
  const leadM = body.match(/<p class="[^"]*\blead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    || body.match(/<p class="[^"]*lead[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  return leadM ? leadM[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}

// ─── OAuth 1.0a 署名生成 ───

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

// ─── ツイート作成 ───

function buildTweetText(data, body, slug) {
  const lead = extractLead(body);
  const workUrl = `${SITE}/works/${slug}/`;
  const tags = Array.isArray(data.tags)
    ? data.tags.slice(0, 3).map((t) => `#${String(t).replace(/\s+/g, '')}`)
    : [];
  const fixedTags = ['#Webデザイン', '#ホームページ制作', '#SaneDesign'];
  const allTags = [...new Set([...tags, ...fixedTags])];
  const tagStr = allTags.join(' ');

  const lines = [`【制作実績】${data.title}`];
  if (data.industry) lines.push(`業種：${data.industry}`);
  const headerLen = lines.join('\n').length;
  const reserved = 23 + 2 + tagStr.length + 4;
  const budget = TWEET_LIMIT - headerLen - reserved;

  if (lead && budget > 30) {
    const trimmedLead = lead.length > budget ? lead.slice(0, budget - 1) + '…' : lead;
    lines.push('', trimmedLead);
  }
  lines.push('', workUrl);
  lines.push('', tagStr);
  return lines.join('\n');
}

/** ブログ記事用のツイートテキストを生成 */
function buildBlogTweetText(data, body, slug) {
  const blogUrl = `${SITE}/blog/${slug}/`;
  const tags = Array.isArray(data.tags)
    ? data.tags.slice(0, 3).map((t) => `#${String(t).replace(/\s+/g, '')}`)
    : [];
  const fixedTags = ['#ブログ更新', '#ホームページ制作', '#SaneDesign'];
  const allTags = [...new Set([...tags, ...fixedTags])];
  const tagStr = allTags.join(' ');

  const lines = [`【ブログ更新】${data.title}`];
  const headerLen = lines.join('\n').length;
  const reserved = 23 + 2 + tagStr.length + 4;
  const budget = TWEET_LIMIT - headerLen - reserved;

  // descriptionを優先、なければ本文冒頭
  let desc = data.description || '';
  if (!desc) {
    desc = body
      .replace(/^---[\s\S]*?---/, '')
      .replace(/<[^>]+>/g, '')
      .replace(/^#+\s.*$/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200);
  }

  if (desc && budget > 30) {
    const trimmedDesc = desc.length > budget ? desc.slice(0, budget - 1) + '…' : desc;
    lines.push('', trimmedDesc);
  }
  lines.push('', blogUrl);
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

async function main() {
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    err('X API認証情報が未設定です'); process.exit(1);
  }
  const fs = await import('node:fs/promises');
  const files = (CHANGED_FILES || '').split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && s.endsWith('.md') && (s.includes('content/works/') || s.includes('content/blog/')));

  if (files.length === 0) { log('対象の新規ファイルなし。終了。'); return; }
  log(`対象 ${files.length} 件: ${files.join(', ')}`);

  const results = [];
  for (const file of files) {
    try {
      const raw = await fs.readFile(file, 'utf8');
      const { data, body } = parseFrontmatter(raw);
      if (String(data.draft) === 'true') { log(`skip (draft): ${file}`); continue; }
      if (!data.title) { err(`title 無し、skip: ${file}`); continue; }

      const slug = file.split('/').pop().replace(/\.md$/, '');
      const isBlog = file.includes('content/blog/');
      const text = isBlog
        ? buildBlogTweetText(data, body, slug)
        : buildTweetText(data, body, slug);
      log(`[${isBlog ? 'blog' : 'work'}] tweet text (${text.length}文字):\n${text}`);

      const result = await postTweet(text);
      const tweetId = result.data?.id;
      log(`posted: https://x.com/i/status/${tweetId}`);
      results.push({ file, ok: true, id: tweetId });
      await sleep(2000);
    } catch (e) {
      err(`${file}: ${e.message}`);
      results.push({ file, ok: false, error: e.message });
    }
  }

  const failed = results.filter((r) => !r.ok);
  log(`完了: 成功 ${results.filter((r) => r.ok).length} / 失敗 ${failed.length}`);
  if (failed.length) process.exit(1);
}

main().catch((e) => { err(e.stack || e.message); process.exit(1); });
