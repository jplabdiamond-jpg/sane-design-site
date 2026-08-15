// scripts/pinterest-autopost.mjs
// 新規追加された works/*.md を Pinterest に自動投稿する。
// GitHub Actions から実行。環境変数:
//   PINTEREST_ACCESS_TOKEN  Pinterest APIアクセストークン
//   PINTEREST_BOARD_ID      投稿先ボードのID
//   CHANGED_FILES           今回追加された .md のパス（改行区切り、workflow から渡す）

const SITE = 'https://sane-design.net';
const PINTEREST_API = 'https://api.pinterest.com/v5';
const { PINTEREST_ACCESS_TOKEN, PINTEREST_BOARD_ID, CHANGED_FILES } = process.env;

const log = (...a) => console.log('[pinterest-autopost]', ...a);
const err = (...a) => console.error('[pinterest-autopost:ERROR]', ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Pinterest ピンのタイトル上限: 100文字
const TITLE_LIMIT = 100;
// Pinterest ピンの説明上限: 500文字
const DESC_LIMIT = 500;

const clen = (s) => [...s].length;

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

/** 制作したサイトのURLを取得 */
function extractSiteUrl(body, data) {
  if (data.url) return data.url;
  const links = [...body.matchAll(/href="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]);
  return links.find((u) => !/sane-design\.net/.test(u)) || '';
}

/** Pinterest ピン用の説明文を生成（500文字以内） */
function buildDescription(data, body, slug) {
  const lead = extractLead(body);
  const parts = [];

  if (data.industry) parts.push(`業種：${data.industry}`);
  if (data.role) parts.push(`担当：${data.role}`);
  if (lead) parts.push('', lead);

  // タグをハッシュタグとして追加
  const tags = Array.isArray(data.tags)
    ? data.tags.map((t) => `#${String(t).replace(/\s+/g, '')}`)
    : [];
  const fixedTags = ['#Webデザイン', '#ホームページ制作', '#ポートフォリオ', '#SaneDesign'];
  const allTags = [...new Set([...tags, ...fixedTags])];

  parts.push('', allTags.join(' '));

  let desc = parts.join('\n');
  if (clen(desc) > DESC_LIMIT) {
    desc = [...desc].slice(0, DESC_LIMIT - 1).join('').trimEnd() + '…';
  }
  return desc;
}

/** Pinterest API にピンを作成 */
async function createPin({ title, description, imageUrl, linkUrl, boardId }) {
  const body = {
    board_id: boardId,
    title: clen(title) > TITLE_LIMIT
      ? [...title].slice(0, TITLE_LIMIT - 1).join('') + '…'
      : title,
    description,
    link: linkUrl,
    media_source: {
      source_type: 'image_url',
      url: imageUrl,
    },
  };

  const res = await fetch(`${PINTEREST_API}/pins`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINTEREST_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Pinterest API ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

/** URLが本番公開されるまで待つ */
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

async function main() {
  if (!PINTEREST_ACCESS_TOKEN || !PINTEREST_BOARD_ID) {
    err('PINTEREST_ACCESS_TOKEN / PINTEREST_BOARD_ID が未設定です');
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

      // Pinterest は WebP もサポート → JPEG変換不要
      const ok = await waitForImage(imageUrl, { tries: 45, intervalMs: 20000 });
      if (!ok) { err(`画像が公開されず skip: ${imageUrl}`); results.push({ file, ok: false }); continue; }

      const slug = file.split('/').pop().replace(/\.md$/, '');
      const linkUrl = `${SITE}/works/${slug}/`;
      const title = `【制作実績】${data.title}`;
      const description = buildDescription(data, body, slug);

      log(`title: ${title} (${clen(title)}文字)`);
      log(`description: ${clen(description)}文字`);

      const pin = await createPin({
        title,
        description,
        imageUrl,
        linkUrl,
        boardId: PINTEREST_BOARD_ID,
      });
      log(`pin created: ${pin.id}`);
      results.push({ file, ok: true, id: pin.id });

      // Pinterest API レート制限対策（連続投稿時のクールダウン）
      await sleep(3000);
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
