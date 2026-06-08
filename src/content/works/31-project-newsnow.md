---
title: 'ニュースポータルサイト Nows Now'
client: 'News Now'
industry: 'メディア・ニュース'
year: 2026
thumbnail: '/works/work-31.png'
tags:
  - Web
  - SaaS
  - Media
role: 'Design & Development'
order: 0
draft: false
---

<div class="detail-page">

<p class="detail-period">制作期間：7日</p>

<p class="detail-lead">国内外の最新ニュースをジャンル別に自動収集・配信するニュースポータル。Cloudflare Workers 上で稼働するSaaS型プラットフォームとして、大量の情報を快適に読める設計で構築しました。</p>

<div class="detail-body">

## コンセプト

ニュースポータルは「いかに早く・迷わず・読みたい記事へ到達できるか」が体験の核です。本サイトではジャンル別の自動収集・配信を軸に、トップで主要ニュースを俯瞰でき、興味のあるカテゴリへワンタップで潜れる情報設計にしました。読者が「今知りたいこと」に最短で出会える、ストレスフリーな閲覧体験を目指しています。

## デザインで意識した点

大量の記事を扱うため、視認性と一覧性を最優先にカード型レイアウトを採用。見出し・サムネイル・カテゴリラベルの優先順位を明確にし、情報が多くても煩雑に見えないよう余白とグリッドを整えました。配色は長時間読んでも疲れにくいニュートラルなトーンに統一し、メディアとしての信頼感を表現しています。

## 気をつけた箇所

Cloudflare Workers 上で動くSaaSとして、表示速度と安定性を重視して構築しました。自動収集される記事数が増えても破綻しないレイアウトと、スマホ・PC双方での快適な読み心地を両立。無限ローディングや表示崩れを防ぎ、どのデバイスからでもサクサク回遊できることを徹底的に検証して仕上げています。

<p class="detail-cta">
  <a href="https://news-saas-web.news-now2026.workers.dev/" target="_blank" rel="noopener noreferrer" class="site-link-btn-md">公開サイトを見る ↗</a>
</p>

</div>

<figure class="detail-shot">
  <img src="/works/work-31-full.jpg" alt="News Now ニュースポータルサイト 全体キャプチャ" loading="lazy" />
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
