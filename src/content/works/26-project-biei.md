---
title: '星の光の宿BIEI'
client: '星の光の宿BIEI'
industry: '宿泊・観光'
year: 2025
thumbnail: '/works/work-26.webp'
tags:
  - Web
  - 宿泊施設
role: 'Design & Development'
order: 1
draft: false
---

<div class="detail-page">

<p class="detail-period">制作期間：6日</p>

<p class="detail-lead">北海道・美瑛にある宿泊施設のホームページ。満天の星空と雄大な自然という最大の魅力を、写真とゆとりある余白で静かに伝えるデザインで構築しました。</p>

<div class="detail-body">

## コンセプト

「星の光の宿」という名前の通り、この宿の主役は美瑛の自然と夜空です。そこで装飾を極力削ぎ落とし、写真そのものが語る世界観を最大限に活かす方針にしました。訪問者がページを開いた瞬間に「ここで過ごす時間」を想像できるよう、ファーストビューに大きな風景ビジュアルを据え、静けさと非日常感を演出しています。

## デザインで意識した点

深い夜空を思わせるダークトーンと、星の光を思わせる淡いアクセントを組み合わせ、ロマンティックでありながら落ち着いた配色に。余白を贅沢に使い、写真とテキストが呼吸するレイアウトにしました。宿泊予約・アクセス・客室情報といった「予約前に確認したい情報」へスムーズに到達できる導線を整えています。

## 気をつけた箇所

風景写真の美しさを損なわないよう、画質と読み込み速度のバランスを慎重に調整しました。スマホ・タブレット・PCいずれでも星空のグラデーションが美しく表示されるようレスポンシブ最適化を実施。情報を詰め込みすぎず、宿が持つ「静かな特別感」を最後まで崩さないことを意識して仕上げています。

<p class="detail-cta">
  <a href="https://jplabdiamond-jpg.github.io/biei-hoshi-site/index.html" target="_blank" rel="noopener noreferrer" class="site-link-btn-md">公開サイトを見る ↗</a>
</p>

</div>

<figure class="detail-shot">
  <img src="/works/work-26-full.webp" alt="星の光の宿BIEI ホームページ 全体キャプチャ" loading="lazy" />
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
