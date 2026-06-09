---
title: 'FX自動売買システム'
client: 'FX自動売買システム'
industry: 'ファイナンス・FX'
year: 2025
thumbnail: '/works/work-28.png'
tags:
  - System
  - UI/UX
role: 'Design & Development'
order: 3
draft: false
---

<div class="detail-page">

<p class="detail-period">制作期間：開発・調整含む長期</p>

<p class="detail-lead">FX自動売買を行うシステムのGUI設計・開発。WebサイトやLPとは異なり、「触って操作するツール」として、初見でも迷わず使える分かりやすさと、ひと目で状態が把握できる視認性を最優先に構築しました。</p>

<div class="detail-body">

## コンセプト

自動売買システムは、デザインの美しさよりも「誤操作なく、安心して動かせること」が何より重要です。そこで本システムでは、専門知識がなくても直感的に扱えるGUIを目指しました。今どの戦略が稼働しているのか、どの設定がオンなのかが画面を見た瞬間に分かること。操作のたびに迷ったり不安になったりしない、信頼できる操作環境を設計の軸に据えています。

## UI/UXで意識した点

稼働・停止やパラメータのオン／オフは、状態が色とトグルでひと目で分かるよう設計しました。「今オンなのかオフなのか」を考えなくても見て分かることで、誤操作のリスクを下げています。数値設定やステータス表示は情報を詰め込みすぎず、重要な指標から順に視線が流れるよう優先順位を整理。1つの画面で「現状把握」と「操作」が完結する、ダッシュボード的な使い心地にまとめました。

## 気をつけた箇所

金銭が動くシステムだからこそ、操作ミスを誘発しないことを徹底しました。トグルやボタンは押し間違えにくい大きさ・間隔を確保し、重要な操作は状態が明確にフィードバックされるように設計。専門的な画面になりがちな領域でも、初めて触れる人が「これは分かりやすい」と感じられる、ストレスのない操作性に仕上げています。

</div>

<figure class="detail-shot">
  <img src="/works/work-28-full.jpg" alt="FX自動売買システム GUI 画面キャプチャ" loading="lazy" />
  <figcaption>システム GUI ビュー</figcaption>
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
