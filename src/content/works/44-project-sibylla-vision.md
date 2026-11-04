---
title: 'Sibylla Vision（星詠）'
client: 'Sibylla Vision'
industry: 'Webサービス・占い／AI鑑定'
title_en: 'Sibylla Vision'
client_en: 'Sibylla Vision'
industry_en: 'Web Service / Fortune-telling AI'
year: 2026
thumbnail: '/works/work-44.webp'
tags:
  - Web
  - AI
role: 'Design & Development'
order: -12
draft: false
---

<div class="detail-page">

<p class="detail-period">制作期間：14日</p>

<p class="detail-lead">西洋占星術・四柱推命・タロット・姓名判断・数秘術に統計と風水を重ね、これからの転機を読み解くAI占いエージェント「Sibylla Vision（星詠）」。占いたいテーマを選び、必要事項を対話でヒアリングしながら鑑定へ導くチャットボットUIを、星空と金色の神秘的な世界観でまとめたプロジェクトです。</p>

<div class="detail-body">

## コンセプト

本サービスは、占術を選んでAIと対話しながら鑑定を進めるエージェント型の占いアプリです。テーマは「読み物として没入できる、対話型の占い体験」。トップで「占い・統計・風水を重ね、これからの転機を読み解く」と世界観を提示し、西洋占星術・四柱推命・タロット・姓名判断・数秘術・手相・総合鑑定といった占術をカードで並べて選ばせます。たとえばタロットを選ぶと、スプレッド（ワンオラクル／スリーカード／ケルト十字）の選択 → 相談内容の入力 → カードの展開 → 鑑定文の提示、という自然な一連の流れへ。占術ごとに異なる入力項目を対話で一つずつ引き出すことで、知識ゼロの人でも迷わず本格的な鑑定までたどり着ける体験を設計しました。

## デザインで意識した点

配色は深いネイビー／ミッドナイトブルーの背景に金（ゴールド）のアクセントを効かせ、星屑の散る夜空とセリフ体の見出し、目をモチーフにしたシンボルで、占いにふさわしい神秘的でエレガントな世界観を構築しました。鑑定はチャットバブルで進行し、タロットではカードがめくられる演出、鑑定結果は羊皮紙風のパネルに表示するなど、画面そのものが"占いの場"として没入できるよう細部まで作り込んでいます。暗い背景でも長文の鑑定が読みやすいよう、文字色・行間・コントラストを慎重に調整し、荘厳さと可読性を両立させました。

## 気をつけた箇所

最も注力したのは、AIとの対話の自然さと、占術ごとに構造の異なる鑑定フローを一つのUIで破綻なく成立させることです。占星術・四柱推命・タロットなど、必要な入力（生年月日時・氏名・問いなど）は占術によって大きく異なるため、それぞれに最適な順序で対話を組み立て、ユーザーが「何を聞かれているか」で迷わないようにしました。長くなりがちな鑑定結果は、見出し・区切り・「これから意識するとよいこと」といったまとめで構造化し、最後まで読ませる設計に。加えて「鑑定は自己理解のための参考です。大切な判断はご自身で。」という注記を常に添え、占いとの健全な距離感を保つ節度ある表現を徹底しました。スマホでの縦長チャットを前提に、カード選択やカードめくりの操作性、バブルの視認性までモバイルファーストで丁寧に仕上げています。

<p class="detail-cta">
  <a href="https://sibylla-vision.com/" target="_blank" rel="noopener noreferrer" class="site-link-btn-md">公開サイトを見る ↗</a>
</p>

</div>

<figure class="detail-shot">
  <img src="/works/work-44-full.webp" alt="Sibylla Vision（星詠）AI占いエージェント 全体キャプチャ" loading="lazy" />
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
