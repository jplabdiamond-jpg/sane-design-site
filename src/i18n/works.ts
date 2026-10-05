// ────────────────────────────────────────────────
//  実績(works)ページの多言語ラベル
// ────────────────────────────────────────────────
import type { Locale } from './ui';

// ジャンル(タグ)フィルタの表示ラベル
export const GENRE_TAGS = ['Web', 'LP', 'EC', 'Corporate', 'ポータルサイト', 'System', 'DTPデザイン'] as const;

export const GENRE_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    Web: 'WEBサイト',
    LP: 'LP（ランディングページ）',
    EC: 'ECサイト',
    Corporate: 'コーポレートサイト',
    'ポータルサイト': 'ポータルサイト',
    System: 'システム / ツール',
    'DTPデザイン': 'DTPデザイン',
  },
  en: {
    Web: 'Website',
    LP: 'Landing Page',
    EC: 'E-commerce',
    Corporate: 'Corporate',
    'ポータルサイト': 'Portal',
    System: 'System / Tool',
    'DTPデザイン': 'Print Design',
  },
};

// カードに表示する個別タグの英語ラベル
const TAG_EN: Record<string, string> = {
  Corporate: 'Corporate', 'DTPデザイン': 'Print Design', EC: 'E-commerce',
  Entertainment: 'Entertainment', IT: 'IT', LP: 'Landing Page', Media: 'Media',
  Responsive: 'Responsive', SaaS: 'SaaS', System: 'System', 'UI/UX': 'UI/UX',
  Web: 'Web', 'Web Design': 'Web Design',
  'コンサル': 'Consulting', 'スポーツ': 'Sports', 'チラシ': 'Flyer',
  'ナイトワーク': 'Nightlife', 'ハウスクリーニング': 'House Cleaning', 'ブログ': 'Blog',
  'プロモーション': 'Promotion', 'ポータルサイト': 'Portal', 'マッチング': 'Matching',
  '不動産': 'Real Estate', '健康': 'Health', '医療': 'Medical', '宿泊施設': 'Accommodation',
  '小売': 'Retail', '広告': 'Advertising', '建設': 'Construction', '採用': 'Recruiting',
  '教育': 'Education', '映画': 'Film', '求人': 'Jobs', '治療院': 'Clinic', '美容': 'Beauty',
  '自動車': 'Automotive', '自治体': 'Government', '買取': 'Buyback', '農業': 'Agriculture',
  '運送': 'Logistics', '音楽': 'Music', '飲食': 'Food & Drink',
};

/** タグの表示ラベル（en は英訳、ja は原文） */
export function tagLabel(tag: string, lang: Locale): string {
  return lang === 'en' ? (TAG_EN[tag] ?? tag) : tag;
}

/** 業種文字列の主カテゴリ（ja は「・」、en は「 / 」で分割した先頭） */
export function industryPrimary(industry: string, lang: Locale): string {
  if (!industry) return '';
  return lang === 'en' ? industry.split(' / ')[0].trim() : industry.split('・')[0].trim();
}

// 実績ページ共通 UI 文言
export const WORKS_UI = {
  ja: {
    crumb: '制作実績',
    heroSub: 'Works',
    heroTitle: 'これまでの制作例',
    heroDescA: 'DTP・WEB 合わせて 300 件以上の実績より、',
    heroDescB: '代表的なプロジェクトをご紹介します。',
    statWorks: '制作実績',
    statKinds: 'WEBサイト・LP・ECサイト etc...',
    statKindsLabel: '制作可能デザイン',
    filterAll: 'すべて表示',
    filterGenre: 'サイトジャンル',
    filterIndustry: '業種',
    viewDetail: '詳しく見る →',
    viewExternal: 'サイトを見る ↗',
    ctaHeading: 'まずはwebデザインを無料で相談！',
    ctaText1: '知識や説明があまりできなくても大丈夫です！',
    ctaText2: 'まずは一度ご相談頂けましたら、こちらから様々な提案をさせて頂きます。',
    ctaBtn: '無料で相談してみる',
    // 詳細ページ
    dClient: 'クライアント',
    dIndustry: '業種',
    dYear: '制作年',
    dRole: '担当',
    dViewSite: '公開サイトを見る',
    dViewSiteShort: 'サイトを見る',
    dBackList: '制作実績の一覧へ戻る',
    dServiceLink: 'ホームページ制作のサービス詳細',
    dConsultLink: 'この実績について相談する',
    dJaNote: 'この実績の詳しい解説は日本語でご覧いただけます。',
    dCtaHeading: 'まずは気軽にご相談ください',
    dCtaText: '相談は無料。「何も分からない」状態で大丈夫です。<br>しつこい営業は一切しません。',
    dCtaBtn: '無料で相談してみる（入力は1分）',
    dCtaNote: 'お問い合わせフォームは30秒ほどで完了します',
  },
  en: {
    crumb: 'Works',
    heroSub: 'Works',
    heroTitle: 'Our work',
    heroDescA: 'From 300+ projects across print and web,',
    heroDescB: 'here are some representative pieces.',
    statWorks: 'Projects',
    statKinds: 'Website / Landing Page / E-commerce etc...',
    statKindsLabel: 'What we can design',
    filterAll: 'Show all',
    filterGenre: 'Site type',
    filterIndustry: 'Industry',
    viewDetail: 'View details →',
    viewExternal: 'Visit site ↗',
    ctaHeading: 'Start with a free web design consultation!',
    ctaText1: "It's fine even if you can't explain the details!",
    ctaText2: 'Just reach out once and we will propose ideas from our side.',
    ctaBtn: 'Get a free consultation',
    dClient: 'Client',
    dIndustry: 'Industry',
    dYear: 'Year',
    dRole: 'Role',
    dViewSite: 'Visit the live site',
    dViewSiteShort: 'Visit site',
    dBackList: 'Back to all work',
    dServiceLink: 'Website production service',
    dConsultLink: 'Ask about this project',
    dJaNote: 'The detailed write-up for this project is available in Japanese.',
    dCtaHeading: 'Start with a casual chat',
    dCtaText: "Consultation is free. It's fine to start knowing nothing.<br>We never do pushy sales.",
    dCtaBtn: 'Try a free consultation (1 min to fill in)',
    dCtaNote: 'The contact form takes about 30 seconds',
  },
} as const;
