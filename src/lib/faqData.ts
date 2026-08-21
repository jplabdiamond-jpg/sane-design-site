// FAQ データ（日英）。ページ本文と FAQPage 構造化データで共通利用。
import type { Locale } from '../i18n/ui';

type QA = { q: string; a: string };

const FAQS: Record<Locale, QA[]> = {
  ja: [
    { q: 'ホームページ制作の料金はいくらですか？', a: 'Sane Designのホームページ制作は20,000円〜です。TOPページ＋4ページの構成を最速3〜4営業日で納品します。ページ数や機能の追加に応じてお見積もりしますので、まずはお気軽にご相談ください。' },
    { q: '最短でどのくらいの納期で作れますか？', a: ' 最速3営業日での納品が可能です。画像とイメージをお渡しいただければ、完全オーダーメイドで制作します。お急ぎの場合は事前にご相談いただければ、可能な限り調整いたします。' },
    { q: 'ホームページ制作を依頼するときに必要なものは？', a: '掲載したい画像・テキスト・参考にしたいサイトのイメージをお渡しいただくだけで制作を進められます。素材がそろっていない場合も、ヒアリングしながら一緒に内容を固めていきますのでご安心ください。' },
    { q: '個人事業主や小さなお店でも依頼できますか？', a: 'はい。Sane Designは個人事業主・中小企業・店舗のホームページ制作を専門としています。大手制作会社より低価格・短納期で、集客につながるサイトを制作します。' },
    { q: 'SEO対策もお願いできますか？', a: 'はい。内部SEO対策と、指定キーワードに基づくブログ記事の追加に対応しています。料金は10,000円〜です。なお検索順位の変動には通常数週間〜数ヶ月かかります。' },
    { q: 'スマートフォン表示（レスポンシブ）に対応していますか？', a: 'すべての制作物はスマートフォン・タブレット・PCに対応したレスポンシブデザインで制作します。モバイル表示を最優先に設計しています。' },
    { q: '制作後の修正や運用サポートはありますか？', a: '納品後の軽微な修正に対応しています。継続的な更新・運用サポートをご希望の場合は内容に応じてご相談ください。' },
    { q: 'チラシやロゴなどのデザインも依頼できますか？', a: 'はい。DTPデザイン（チラシ・フライヤー・ロゴ・名刺など）もWeb制作と合わせて承っています。DTP・WEB合わせて300件以上の制作実績があります。' },
    { q: '対応エリアはどこですか？', a: 'オンラインで全国対応しています。打ち合わせ・素材のやり取り・納品まで、すべてオンラインで完結しますので、地域を問わずご依頼いただけます。' },
    { q: '支払い方法は何が使えますか？', a: 'オンライン決済に対応しています。詳細はお問い合わせ・ご注文時にご案内します。' },
  ],
  en: [
    { q: 'How much does website production cost?', a: "Sane Design's website production starts at ¥20,000. We deliver a top page plus 4 pages in as few as 3–4 business days. We'll quote based on any additional pages or features, so feel free to reach out first." },
    { q: 'How quickly can you build it?', a: "Delivery in as few as 3 business days is possible. Just share your images and ideas and we'll build it fully custom. If you're in a hurry, let us know in advance and we'll adjust as much as we can." },
    { q: 'What do I need to prepare to request website production?', a: "Just share the images, text, and reference sites you'd like. Even if your materials aren't ready, we'll shape the content together through a short interview — no worries." },
    { q: 'Can sole proprietors or small shops order too?', a: 'Yes. Sane Design specializes in websites for sole proprietors, small businesses, and shops. We build sites that bring in customers, at a lower price and faster than large agencies.' },
    { q: 'Can you handle SEO too?', a: 'Yes. We handle internal SEO and adding blog articles based on your target keywords, from ¥10,000. Note that search ranking changes usually take several weeks to a few months.' },
    { q: 'Is it responsive (mobile-friendly)?', a: 'All our work is responsive for smartphone, tablet, and PC. We design mobile-first.' },
    { q: 'Is there post-launch editing or operational support?', a: 'We handle minor edits after delivery. For ongoing updates and operational support, please consult us based on your needs.' },
    { q: 'Can you design flyers or logos too?', a: 'Yes. We also handle DTP design (flyers, logos, business cards, etc.) alongside web production. We have 300+ projects across print and web.' },
    { q: 'What areas do you serve?', a: 'We serve all of Japan online. Meetings, material exchange, and delivery are all completed online, so you can order from anywhere.' },
    { q: 'What payment methods are available?', a: 'We accept online payments. Details are provided at the time of inquiry or order.' },
  ],
};

export function getFaqs(lang: Locale): QA[] {
  return FAQS[lang] ?? FAQS.ja;
}

export function faqJsonLd(lang: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getFaqs(lang).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
