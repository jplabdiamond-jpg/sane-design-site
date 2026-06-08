---
title: 'コーポレートサイト制作'
client: 'お遍路宿 亀龍'
industry: '宿泊・観光'
year: 2025
thumbnail: '/works/work-20.jpg'
tags:
  - Corporate
  - Responsive
role: 'Design & Development'
order: 2
draft: false
---

<div class="detail-page">

<p class="detail-period">制作期間：5日</p>

<p class="detail-lead">四国お遍路の巡礼者が安心して泊まれる宿のコーポレートサイト。長旅の疲れを癒す「温かみ」と「信頼感」を軸に、初めて訪れる人にも宿の人柄が伝わるデザインで構築しました。</p>

<div class="detail-body">

## コンセプト

お遍路という文化的背景を持つ宿だからこそ、派手さよりも「迎え入れる静けさ」を大切にしました。巡礼で歩き疲れた旅人がスマホで宿を探す場面を想定し、ファーストビューで宿の雰囲気・立地・温かさが一目で伝わる構成に。写真を主役に据え、文字情報は要点だけを残して、読む負担を最小限にしています。

## デザインで意識した点

四国・遍路道の自然になじむアースカラーを基調に、和の落ち着きと現代的な見やすさを両立させました。見出しや料金、アクセスなど「旅人が本当に知りたい情報」へ最短でたどり着けるよう導線を整理。予約・問い合わせボタンは常に押しやすい位置に固定し、迷わせない設計にしています。

## 気をつけた箇所

利用者の多くが年齢層の高い巡礼者であることを踏まえ、文字サイズ・コントラスト・タップ領域を大きめに確保しました。すべてレスポンシブ対応とし、スマホでもPCでも崩れず読めること、そして写真の温度感が損なわれないことを最後まで丁寧に調整しています。

<p class="detail-cta">
  <a href="https://kiryu-shikoku.jp/" target="_blank" rel="noopener noreferrer" class="site-link-btn-md">公開サイトを見る ↗</a>
</p>

</div>

<figure class="detail-shot">
  <img src="/works/work-20-full.jpg" alt="お遍路宿 亀龍 コーポレートサイト 全体キャプチャ" loading="lazy" />
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
