#!/usr/bin/env node
/**
 * IndexNow 通知スクリプト
 *
 * デプロイ後に実行して、Bing/Yandex に更新を即時通知します。
 *
 * 使い方:
 *   node scripts/indexnow-notify.mjs                    # 主要ページ全てを通知
 *   node scripts/indexnow-notify.mjs /blog/new-post/    # 特定URLのみ通知
 */

const SITE_HOST = 'sane-design.net';
const API_KEY = 'b2aad5ac17ec43ae93a6e4bb9572878f';

// 通知するURL一覧（引数なしの場合、主要ページを全て通知）
const defaultUrls = [
  '/',
  '/works/',
  '/services/web-design/',
  '/services/seo/',
  '/blog/',
  '/about/',
  '/faq/',
  '/contact/',
  '/recruit/',
];

const args = process.argv.slice(2);
const urlPaths = args.length > 0 ? args : defaultUrls;
const urlList = urlPaths.map((p) =>
  p.startsWith('http') ? p : `https://${SITE_HOST}${p}`
);

async function notify() {
  const body = {
    host: SITE_HOST,
    key: API_KEY,
    keyLocation: `https://${SITE_HOST}/${API_KEY}.txt`,
    urlList,
  };

  console.log(`IndexNow: ${urlList.length} URL(s) を通知中...`);

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (res.ok || res.status === 202) {
      console.log(`✅ 成功 (HTTP ${res.status})`);
      urlList.forEach((u) => console.log(`   📄 ${u}`));
    } else {
      const text = await res.text();
      console.error(`❌ エラー (HTTP ${res.status}): ${text}`);
    }
  } catch (err) {
    console.error('❌ ネットワークエラー:', err.message);
  }
}

notify();
