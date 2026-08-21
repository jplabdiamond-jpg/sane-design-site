// ────────────────────────────────────────────────
//  i18n — locale config & UI (chrome) dictionary
//  日本語 = デフォルト（プレフィックスなし） / 英語 = /en/
// ────────────────────────────────────────────────

export const DEFAULT_LOCALE = 'ja' as const;
export const LOCALES = ['ja', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

// 英語版が存在するルート（末尾スラッシュ付きで登録）。
// ページを英訳するたびにここへ追加すると、EN のナビ／切替リンクが
// 実在する /en/... だけを指し、未翻訳ページは日本語版へフォールバックする。
export const EN_AVAILABLE: string[] = [
  '/', // トップページ
];

// 共通 UI（ヘッダー・フッター・CTA など）の翻訳
export const ui = {
  ja: {
    'lang.switch': '言語',
    'lang.ja': '日本語',
    'lang.en': 'English',
    'nav.menu': 'メニュー',
    // RenewalLayout（トップページ用）ヘッダー
    'rn.reasons': '選ばれる理由',
    'rn.services': 'サービス',
    'rn.pricing': '料金',
    'rn.works': '制作実績',
    'rn.blog': 'ブログ',
    'rn.faq': 'よくある質問',
    'rn.consult': '無料で相談',
    'rn.footWorks': '実績',
    'rn.footContact': 'お問い合わせ',
    'rn.copy': '高品質なwebサイトを、低価格で。',
    'rn.stickyConsult': '無料で相談する',
    // BaseLayout フッター
    'foot.tagline': 'Web制作・SEO対策専門スタジオ',
    'foot.track': '実績300件以上',
    'foot.navigation': 'Navigation',
    'foot.contact': 'Contact',
    'foot.contactLink': 'お問い合わせ',
    'foot.studio': 'Web Design & SEO Studio — Japan',
    'foot.rights': 'All rights reserved.',
    'crumb.home': 'Home',
    // CTABanner
    'cta.newProject': 'New Project',
    'cta.headline': "Let's work together.",
    'cta.subline': '新しいプロジェクトのご依頼・ご相談をお待ちしております',
    'cta.order': '今すぐ注文する →',
    'cta.consult': 'まずは相談する',
    'cta.email': 'またはメールで問い合わせる →',
  },
  en: {
    'lang.switch': 'Language',
    'lang.ja': '日本語',
    'lang.en': 'English',
    'nav.menu': 'Menu',
    'rn.reasons': 'Why Us',
    'rn.services': 'Services',
    'rn.pricing': 'Pricing',
    'rn.works': 'Works',
    'rn.blog': 'Blog',
    'rn.faq': 'FAQ',
    'rn.consult': 'Free Consultation',
    'rn.footWorks': 'Works',
    'rn.footContact': 'Contact',
    'rn.copy': 'High-quality websites, at a low price.',
    'rn.stickyConsult': 'Free Consultation',
    'foot.tagline': 'Web Design & SEO Studio',
    'foot.track': '300+ projects delivered',
    'foot.navigation': 'Navigation',
    'foot.contact': 'Contact',
    'foot.contactLink': 'Contact Us',
    'foot.studio': 'Web Design & SEO Studio — Japan',
    'foot.rights': 'All rights reserved.',
    'crumb.home': 'Home',
    'cta.newProject': 'New Project',
    'cta.headline': "Let's work together.",
    'cta.subline': "We'd love to hear about your new project or answer any questions.",
    'cta.order': 'Order Now →',
    'cta.consult': 'Get in touch',
    'cta.email': 'Or contact us by email →',
  },
} as const;

export type UIKey = keyof (typeof ui)['ja'];
