// scripts/instagram-autopost.mjs
// 新規追加された works/*.md を Instagram に自動投稿する。
// GitHub Actions から実行。環境変数:
//   IG_USER_ID       Instagram ビジネスアカウントID
//   IG_ACCESS_TOKEN  長期アクセストークン
//   CHANGED_FILES    今回追加された .md のパス（改行区切り、workflow から渡す）

const SITE = 'https://sane-design.net';
const GRAPH = 'https://graph.facebook.com/v21.0';
const { IG_USER_ID, IG_ACCESS_TOKEN, CHANGED_FILES } = process.env;

const CAPTION_LIMIT = 2200;
const MAX_HASHTAGS = 30;
const FIXED_HASHTAGS = [
  '#webデザイン', '#Webデザイン', '#ホームページ制作', '#サイト制作',
  '#LP制作', '#ランディングページ', '#Web制作', '#ホームページ',
  '#Webサイト', '#Webデザイナー', '#フリーランスデザイナー', '#デザイン',
  '#WebDesign', '#ポートフォリオ', '#SaneDesign',
];

const clen = (s) => [...s].length;

const log = (...a) => console.log('[ig-autopost]', ...a);
const err = (...a) => console.error('[ig-autopost:ERROR]', ...a);
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

/** 本文からリード文・制作ポイント（##セクション）を抽出 */
function extractParts(body) {
  let b = body
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')
    .replace(/<p class="[^"]*cta[^"]*">[\s\S]*?<\/p>/gi, '');

  const leadM = b.match(/<p class="[^"]*\blead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    || b.match(/<p class="[^"]*lead[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const lead = leadM ? leadM[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  if (leadM) b = b.replace(leadM[0], '');

  const sections = [];
  const heads = [...b.matchAll(/^##\s+(.+)$/gm)];
  for (let i = 0; i < heads.length; i++) {
    const start = heads[i].index + heads[i][0].length;
    const end = i + 1 < heads.length ? heads[i + 1].index : b.length;
    const text = b.slice(start, end).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) sections.push({ h: heads[i][1].replace(/<[^>]+>/g, '').trim(), t: text });
  }
  return { lead, sections };
}

function extractSiteUrl(body, data) {
  if (data.url) return data.url;
  const links = [...body.matchAll(/href="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]);
  return links.find((u) => !/sane-design\.net/.test(u)) || '';
}

function buildHashtags(data) {
  const own = Array.isArray(data.tags)
    ? data.tags.map((t) => '#' + String(t).replace(/\s+/g, ''))
    : [];
  return [...new Set([...own, ...FIXED_HASHTAGS])].slice(0, MAX_HASHTAGS);
}

async function ensureJpegUrl(imageUrl) {
  if (/\.jpe?g$/i.test(imageUrl)) {
    log(`image already JPEG: ${imageUrl}`);
    return imageUrl;
  }
  const jpegUrl = imageUrl.replace(/\.webp$/i, '.jpg');
  try {
    const check = await fetch(jpegUrl, { method: 'HEAD' });
    if (check.ok) { log(`JPEG already available: ${jpegUrl}`); return jpegUrl; }
  } catch (e) { /* 無ければ変換する */ }

  log(`converting WebP to JPEG: ${imageUrl}`);
  const sharp = (await import('sharp')).default;
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const { execSync } = await import('node:child_process');

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status} ${imageUrl}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const jpegBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();

  const urlPath = new URL(imageUrl).pathname;
  const localPath = path.join('public', urlPath.replace(/\.webp$/i, '.jpg'));
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, jpegBuffer);
  log(`saved JPEG: ${localPath} (${jpegBuffer.length} bytes)`);

  try {
    execSync(`git add "${localPath}"`, { stdio: 'pipe' });
    execSync(`git commit -m "chore: add JPEG for Instagram autopost (${path.basename(localPath)})" --no-verify`, { stdio: 'pipe' });
    execSync('git push', { stdio: 'pipe' });
    log(`pushed JPEG to repo: ${localPath}`);
  } catch (e) { log(`git push warning: ${e.message}`); }
  return jpegUrl;
}

async function waitForImage(url, { tries = 30, intervalMs = 20000 } = {}) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) { log(`image live: ${url}`); return true; }
      log(`image not ready (${res.status}) [${i}/${tries}] ${url}`);
    } catch (e) { log(`image check failed [${i}/${tries}]: ${e.message}`); }
    if (i < tries) await sleep(intervalMs);
  }
  return false;
}

function buildCaption(data, body, slug) {
  const { lead, sections } = extractParts(body);
  const siteUrl = extractSiteUrl(body, data);
  const header = [`【制作実績】${data.title}`];
  if (data.industry) header.push(`業種：${data.industry}`);
  if (data.role) header.push(`担当：${data.role}`);
  const headerStr = header.join('\n');

  const footerLines = [];
  if (siteUrl) footerLines.push('▼制作したサイト', siteUrl, '');
  footerLines.push('▼その他の制作実績はこちら', `${SITE}/works/${slug}/`, '');
  footerLines.push(buildHashtags(data).join(' '));
  const footer = footerLines.join('\n');

  const parts = [];
  if (lead) parts.push(lead);
  for (const s of sections) parts.push(`■${s.h}\n${s.t}`);
  let bodyBlock = parts.join('\n\n');

  const budget = CAPTION_LIMIT - clen(headerStr) - clen(footer) - 4;
  if (clen(bodyBlock) > budget) {
    bodyBlock = [...bodyBlock].slice(0, Math.max(0, budget - 1)).join('').trimEnd() + '…';
  }

  const caption = [headerStr, '', bodyBlock, '', footer].join('\n');
  return clen(caption) > CAPTION_LIMIT ? [...caption].slice(0, CAPTION_LIMIT).join('') : caption;
}

async function graphPost(path, params) {
  const url = `${GRAPH}/${path}`;
  const body = new URLSearchParams({ ...params, access_token: IG_ACCESS_TOKEN });
  const res = await fetch(url, { method: 'POST', body });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`Graph API ${res.status}: ${JSON.stringify(json.error || json)}`);
  }
  return json;
}

async function postOne(imageUrl, caption) {
  const container = await graphPost(`${IG_USER_ID}/media`, { image_url: imageUrl, caption });
  log(`container created: ${container.id}`);
  await sleep(5000);
  const published = await graphPost(`${IG_USER_ID}/media_publish`, { creation_id: container.id });
  log(`published: ${published.id}`);
  return published.id;
}

async function main() {
  if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
    err('IG_USER_ID / IG_ACCESS_TOKEN が未設定です'); process.exit(1);
  }
  const fs = await import('node:fs/promises');
  const files = (CHANGED_FILES || '').split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && s.endsWith('.md') && s.includes('content/works/'));

  if (files.length === 0) { log('対象の新規 work なし。終了。'); return; }
  log(`対象 ${files.length} 件: ${files.join(', ')}`);

  const results = [];
  for (const file of files) {
    try {
      const raw = await fs.readFile(file, 'utf8');
      const { data, body } = parseFrontmatter(raw);
      if (String(data.draft) === 'true') { log(`skip (draft): ${file}`); continue; }
      if (!data.title) { err(`title 無し、skip: ${file}`); continue; }

      const img = data.heroImage || data.thumbnail;
      if (!img) { err(`画像指定無し、skip: ${file}`); continue; }
      let imageUrl = img.startsWith('http') ? img : `${SITE}${img.startsWith('/') ? '' : '/'}${img}`;

      if (/\.webp$/i.test(imageUrl)) {
        imageUrl = await ensureJpegUrl(imageUrl);
      }

      const ok = await waitForImage(imageUrl, { tries: 45, intervalMs: 20000 });
      if (!ok) { err(`画像が公開されず skip: ${imageUrl}`); results.push({ file, ok: false }); continue; }

      const slug = file.split('/').pop().replace(/\.md$/, '');
      const caption = buildCaption(data, body, slug);
      log(`caption ${clen(caption)}文字 / ハッシュタグ${buildHashtags(data).length}個`);
      const id = await postOne(imageUrl, caption);
      results.push({ file, ok: true, id });
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
