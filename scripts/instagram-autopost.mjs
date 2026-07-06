// scripts/instagram-autopost.mjs
// 新規追加された works/*.md を Instagram に自動投稿する。
// GitHub Actions から実行。環境変数:
//   IG_USER_ID       Instagram ビジネスアカウントID
//   IG_ACCESS_TOKEN  長期アクセストークン
//   CHANGED_FILES    今回追加された .md のパス（改行区切り、workflow から渡す）
//
// レスポンスは success / error に統一。全ステップでログ出力。

const SITE = 'https://sane-design.net';
const GRAPH = 'https://graph.facebook.com/v21.0';
const { IG_USER_ID, IG_ACCESS_TOKEN, CHANGED_FILES } = process.env;

const FIXED_HASHTAGS = ['#WebDesign', '#ポートフォリオ', '#SaneDesign', '#ホームページ制作'];

const log = (...a) => console.log('[ig-autopost]', ...a);
const err = (...a) => console.error('[ig-autopost:ERROR]', ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** frontmatter を最小パース（依存ライブラリ不要） */
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
      if (v === '') { data[key] = []; continue; } // 配列見出し
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

/** 本文の detail-lead を抜き出してキャプション用リード文に */
function extractLead(body) {
  const m = body.match(/<p class="detail-lead">([\s\S]*?)<\/p>/);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/** URLが本番公開されるまで待つ（Cloudflare Pages デプロイ待ち） */
async function waitForImage(url, { tries = 30, intervalMs = 20000 } = {}) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) { log(`image live: ${url}`); return true; }
      log(`image not ready (${res.status}) [${i}/${tries}] ${url}`);
    } catch (e) {
      log(`image check failed [${i}/${tries}]: ${e.message}`);
    }
    if (i < tries) await sleep(intervalMs);
  }
  return false;
}

function buildCaption(data, body) {
  const lead = extractLead(body);
  const lines = [];
  lines.push(`【制作実績】${data.title}`);
  if (data.industry) lines.push(`業種：${data.industry}`);
  if (lead) lines.push('', lead);
  if (data.url) lines.push('', `▼公開サイト\n${data.url}`);
  lines.push('', `ポートフォリオ一覧 → ${SITE}`);
  const tags = [
    ...(Array.isArray(data.tags) ? data.tags.map((t) => '#' + String(t).replace(/\s+/g, '')) : []),
    ...FIXED_HASHTAGS,
  ];
  lines.push('', [...new Set(tags)].join(' '));
  return lines.join('\n');
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
  // ① メディアコンテナ作成
  const container = await graphPost(`${IG_USER_ID}/media`, { image_url: imageUrl, caption });
  log(`container created: ${container.id}`);
  // コンテナ処理待ち（大きめ画像対策）
  await sleep(5000);
  // ② 公開
  const published = await graphPost(`${IG_USER_ID}/media_publish`, { creation_id: container.id });
  log(`published: ${published.id}`);
  return published.id;
}

async function main() {
  if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
    err('IG_USER_ID / IG_ACCESS_TOKEN が未設定です');
    process.exit(1);
  }
  const fs = await import('node:fs/promises');
  const files = (CHANGED_FILES || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && s.endsWith('.md') && s.includes('content/works/'));

  if (files.length === 0) {
    log('対象の新規 work なし。終了。');
    return;
  }
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
      const imageUrl = img.startsWith('http') ? img : `${SITE}${img.startsWith('/') ? '' : '/'}${img}`;

      const ok = await waitForImage(imageUrl);
      if (!ok) { err(`画像が公開されず skip: ${imageUrl}`); results.push({ file, ok: false }); continue; }

      const caption = buildCaption(data, body);
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
