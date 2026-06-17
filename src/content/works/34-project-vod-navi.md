---
title: 'VODナビ'
client: 'VODナビ'
industry: 'メディア・ガジェットレビュー'
year: 2026
thumbnail: '/works/work-34.jpg'
tags:
  - Web
  - Media
  - Responsive
role: 'Design & Development'
order: -2
draft: false
---

<div class="detail-page">

<p class="detail-period">制作期間：7日</p>

<p class="detail-lead">実機購入・実測比較を軸にした大規模レビューメディア。50を超えるカテゴリを扱いながらも破綻しない情報設計で、読者が目的の製品ジャンルへ最短で到達できる体験を構築しました。</p>

<div class="detail-body">

## コンセプト

扱うカテゴリ数が非常に多いサイトでは、「情報量の多さ」を「探しやすさ」に変える設計が成否を分けます。本サイトではジャンルをテーマごとに整理し、デスク環境・入力デバイス・撮影機材・配信機材など目的別にセクション化。読者が「自分の知りたい領域」へ迷わず潜り込め、比較検討から購入判断までスムーズに進める導線を最優先に設計しました。

## デザインで意識した点

大量のカテゴリを並べても圧迫感が出ないよう、アイコン付きの見出しと統一されたカードグリッドで情報を整理しました。セクションごとにリズムをつけ、スクロールしても飽きさせない構成に。配色とタイポグラフィは可読性を重視し、専門的な内容でも「読みやすく・信頼できる」印象を保つよう細部まで調整しています。

## 気をつけた箇所

ページが縦に長くなる大規模サイトのため、表示速度とモバイルでの快適さを徹底検証しました。モバイルファーストで横スクロールや表示崩れを排除し、膨大なカテゴリカードを並べてもレイアウトが破綻しないことを確認。どのデバイスからでも軽快に回遊でき、目的の記事へストレスなくたどり着けることを最後まで丁寧に仕上げています。

<p class="detail-cta">
  <a href="https://vod.best-recommend.com/" target="_blank" rel="noopener noreferrer" class="site-link-btn-md">公開サイトを見る ↗</a>
</p>

</div>

<figure class="detail-shot">
  <img src="/works/work-34-full.jpg" alt="VODナビ レビューメディア 全体キャプチャ" loading="lazy" />
  <figcaption>サイト全体ビュー</figcaption>
</figure>

</div>

<style>
  article header h1 {
    font-size: clamp(26px, 3.4vw, 40px) !important;
    line-height: 1.35 !important;
  }
  .prose-custom { max-width: none !important; }
  .detail-page { max-width: 860px; margin: 0; text-align: left; }
  .detail-period {
    font-size: 13px; letter-spacing: 0.08em;
    color: var(--color-muted); margin-bottom: 12px;
  }
  .detail-lead {
    font-size: clamp(16px, 1.6vw, 19px); line-height: 1.9;
    color: var(--color-text); max-width: 680px;
    margin-bottom: 8px; padding-bottom: 32px;
    border-bottom: 1px solid var(--color-border);
  }
  .detail-body { max-width: 720px; text-align: left; }
  .detail-body h2 {
    text-align: left; font-size: clamp(20px, 2.2vw, 26px);
    margin-top: 48px; margin-bottom: 16px;
    padding-left: 14px; border-left: 3px solid var(--color-primary);
  }
  .detail-body p { text-align: left; }
  .detail-cta { margin: 44px 0 0; text-align: left; }
  .detail-shot {
    margin: 72px auto 0; width: 100%; max-width: 1000px; text-align: center;
  }
  .detail-shot img {
    display: block; margin: 0 auto; width: 100%; height: auto;
    border: 1px solid var(--color-border);
    box-shadow: 0 16px 56px rgba(0,0,0,0.14);
  }
  .detail-shot figcaption {
    margin-top: 16px; font-size: 12px;
    color: var(--color-muted); letter-spacing: 0.06em;
  }
  .site-link-btn-md {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; border: 1px solid var(--color-primary);
    color: var(--color-primary); text-decoration: none;
    font-size: 13px; letter-spacing: 0.08em; font-weight: 500;
    transition: background 0.25s ease, color 0.25s ease;
  }
  .site-link-btn-md:hover { background: var(--color-primary); color: #fff; }
  @media (max-width: 640px) { .detail-shot { margin-top: 48px; } }
</style>
