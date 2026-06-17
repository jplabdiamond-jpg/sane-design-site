---
title: 'GADGET LINE'
client: 'GADGET LINE'
industry: 'メディア・ガジェットレビュー'
year: 2026
thumbnail: '/works/work-33.jpg'
tags:
  - Web
  - Media
  - Responsive
role: 'Design & Development'
order: -3
draft: false
---

<div class="detail-page">

<p class="detail-period">制作期間：7日</p>

<p class="detail-lead">編集部が自費で購入したガジェット・PC周辺機器だけを、実測データで比較するレビューメディア。膨大な製品情報を「迷わず・読みやすく」届けることに特化した、回遊性の高い構成で構築しました。</p>

<div class="detail-body">

## コンセプト

レビューメディアは「読みたい製品カテゴリへ、いかに速く・迷わず到達できるか」が体験の核です。本サイトではカテゴリ別の比較記事を軸に、トップで人気カテゴリを俯瞰でき、興味のあるジャンルへワンタップで潜れる情報設計にしました。「実機購入・実測比較」という信頼性を前面に出し、読者が安心して製品選びを進められる体験を目指しています。

## デザインで意識した点

多数のカテゴリと製品を扱うため、視認性と一覧性を最優先にカード型レイアウトを採用。アイコン付きのセクション見出しで各ジャンルの役割を明確化し、情報量が多くても煩雑に見えないよう余白とグリッドを整えました。配色は信頼感のあるニュートラルなトーンにアクセントカラーを効かせ、メディアとしての専門性と親しみやすさを両立しています。

## 気をつけた箇所

スマホで読まれることを前提に、モバイルファーストで設計しました。横スクロールや表示崩れを排除し、ヒーロー動画や多数のカテゴリカードを並べても表示が破綻しないことを徹底検証。実測データを扱う性質上、数値が読みやすいタイポグラフィと、どのデバイスからでもサクサク回遊できる軽快さを最後まで丁寧に仕上げています。

<p class="detail-cta">
  <a href="https://gadget.best-recommend.com/" target="_blank" rel="noopener noreferrer" class="site-link-btn-md">公開サイトを見る ↗</a>
</p>

</div>

<figure class="detail-shot">
  <img src="/works/work-33-full.jpg" alt="GADGET LINE ガジェットレビューメディア 全体キャプチャ" loading="lazy" />
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
