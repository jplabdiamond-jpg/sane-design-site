# Sane Design Portfolio Site

> Astro 5 + Tailwind CSS + Cloudflare Pages で構築する、ポートフォリオ＆ブログサイト。
> デザイン参照: Cargo Collective（エディトリアル × ミニマル、白黒 + ブランドレッド）

---

## 0. 前提条件

- Node.js **20以降**
- npm 10以降
- GitHub アカウント
- Cloudflare アカウント（`sane-design.net` ドメイン取得済み）

確認:
```bash
node --version   # v20.x 以上
npm --version
```

---

## 1. ローカル起動（初回のみ）

プロジェクトフォルダに移動し、依存をインストール:

```bash
cd "/Users/okisaneatsu/Documents/Claude/Projects/様々なSEO対策/sane-design-site"
npm install
npm run dev
```

ブラウザで http://localhost:4321 にアクセス → サイトが表示されれば成功。

---

## 2. 本番ビルド確認

```bash
npm run build
npm run preview
```

`dist/` フォルダに静的ファイルが生成されます。

---

## 3. GitHubリポジトリ作成 → push

### 3-1. GitHub Web UIで新規リポジトリ作成

1. https://github.com/new にアクセス
2. Repository name: **`sane-design-site`**
3. **Private** を推奨（Public でも可）
4. README, .gitignore は追加せず「Create repository」
5. 作成後、`https://github.com/YOUR_USERNAME/sane-design-site.git` のURLをコピー

### 3-2. ローカルからpush

```bash
cd "/Users/okisaneatsu/Documents/Claude/Projects/様々なSEO対策/sane-design-site"

# git初期化（未初期化の場合）
git init

# 初回コミット
git add .
git commit -m "initial commit: sane design portfolio site"

# GitHub連携（URLは自分のに差し替え）
git remote add origin https://github.com/YOUR_USERNAME/sane-design-site.git
git branch -M main
git push -u origin main
```

---

## 4. Cloudflare Pages デプロイ

### 4-1. プロジェクト作成

1. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. GitHub認証後、`sane-design-site` リポジトリを選択
3. **ビルド設定**:

| 項目 | 値 |
|---|---|
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | （空欄） |

4. **環境変数** (Environment variables):

| Key | Value |
|---|---|
| `NODE_VERSION` | `20` |

5. 「Save and Deploy」→ 2〜3分でデプロイ完了

### 4-2. 独自ドメイン接続（`sane-design.net`）

1. デプロイ完了後、Pagesプロジェクトページ → **Custom domains** タブ
2. **Set up a custom domain** → `sane-design.net` を入力 → Continue
3. Cloudflareで同アカウント管理の場合は **自動でDNSレコードが設定**され、SSL証明書も自動発行
4. `www.sane-design.net` も追加したい場合は同じ手順で追加

完了後、`https://sane-design.net` でアクセス可能。

---

## 5. Google Search Console 登録（SEO必須）

1. https://search.google.com/search-console にアクセス
2. **URLプレフィックス** で `https://sane-design.net/` を追加
3. 所有権確認：HTMLタグ方式を選択 → 表示されたmetaタグをコピー
4. `src/layouts/BaseLayout.astro` の `<head>` 内、`<SEO />` コンポーネントの後に貼り付け
5. コミット & push → Cloudflareが自動再デプロイ
6. Search Console に戻って「確認」ボタン → 所有権確認完了
7. **サイトマップ送信**: `sitemap-index.xml` を送信

---

## 6. コンテンツ更新方法

### 6-1. 実績（Works）を追加する

1. `src/content/works/` に新規 `.md` ファイル作成（例: `04-new-project.md`）
2. フロントマター例:

```markdown
---
title: '新規プロジェクト名'
client: 'クライアント名'
industry: '業種'
year: 2026
thumbnail: '/works/new-thumb.jpg'
heroImage: '/works/new-hero.jpg'
tags:
  - Corporate
role: 'Design & Development'
order: 4
---

## 概要
本文をMarkdownで記述...
```

3. 画像は `public/works/` に配置
4. `git add . && git commit -m "add work: xxx" && git push` で自動デプロイ

### 6-2. ブログ記事を追加する

1. `src/content/blog/` に新規 `.md` ファイル作成（例: `02-seo-kiso.md`）
2. フロントマター例:

```markdown
---
title: '記事タイトル'
description: '記事の要約（150字程度、SEOに重要）'
pubDate: '2026-05-01'
tags:
  - SEO
  - 初心者
---

本文...
```

3. 同様に push で自動デプロイ

---

## 7. ディレクトリ構造

```
sane-design-site/
├── astro.config.mjs      # Astro設定（ドメイン、統合）
├── tailwind.config.mjs   # Tailwind設定
├── tsconfig.json         # TypeScript設定
├── package.json
├── public/               # 静的アセット（画像、favicon等）
│   ├── favicon.svg
│   ├── robots.txt
│   ├── og-image.svg
│   └── works/           # 実績画像
└── src/
    ├── consts.ts         # サイト共通情報（タイトル、URL、ココナラリンク）
    ├── styles/
    │   └── global.css    # Cargo Collective準拠のグローバルCSS
    ├── layouts/
    │   └── BaseLayout.astro  # 全ページ共通レイアウト
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── SEO.astro         # メタタグ・OGP・JSON-LD
    │   ├── WorkCard.astro
    │   └── CTABanner.astro
    ├── content/
    │   ├── config.ts         # コンテンツコレクションスキーマ
    │   ├── works/*.md        # 実績記事
    │   └── blog/*.md         # ブログ記事
    └── pages/
        ├── index.astro       # トップページ
        ├── about.astro
        ├── contact.astro
        ├── works/
        │   ├── index.astro   # 実績一覧
        │   └── [...slug].astro  # 実績詳細（動的）
        ├── services/
        │   ├── web-design.astro  # HP制作（→ココナラ商品1）
        │   └── seo.astro         # SEO対策（→ココナラ商品2）
        └── blog/
            ├── index.astro
            └── [...slug].astro
```

---

## 8. カスタマイズポイント

### サイト名・URL変更
→ `src/consts.ts` を編集

### ココナラリンク変更
→ `src/consts.ts` の `COCONALA_HP` / `COCONALA_SEO` を変更

### カラー変更
→ `src/styles/global.css` の `:root` CSS変数を変更

### ナビゲーション追加
→ `src/consts.ts` の `NAV_LINKS` 配列に追加

---

## 9. トラブルシューティング

### Cloudflareビルド失敗「sharp module not found」
→ 環境変数 `NODE_VERSION=20` が設定されているか確認

### ローカルで `npm install` が遅い
→ M1/M2 Macの場合、Rosetta経由で実行せず、ネイティブTerminalで実行

### 画像が表示されない
→ `public/` 配下のパスは `/` から始める（例: `/works/image.jpg`）

### 独自ドメインでSSLが有効にならない
→ Cloudflare DNSの該当レコードが「Proxied」（オレンジ雲）か確認。最大24時間待機

---

## 10. 今後の拡張候補

- [ ] お問い合わせフォーム（Cloudflare Workers + メール送信）
- [ ] RSS feed 追加（`@astrojs/rss`導入済みなので `src/pages/rss.xml.js` を追加）
- [ ] 多言語対応（Astro i18n）
- [ ] ダークモード切替
- [ ] 制作実績のケーススタディページ（画像を大量に掲載する専用レイアウト）

---

## 関連リンク

- ココナラ HP制作: https://coconala.com/services/2605832
- ココナラ SEO対策: https://coconala.com/services/2697889
- Astro Docs: https://docs.astro.build
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/

---

© 2026 Sane Design
