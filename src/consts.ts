export const SITE_TITLE = 'Sane Design｜実績300件以上のWeb制作・SEO対策スタジオ';
export const SITE_DESCRIPTION =
  '最速3日納品・20,000円〜。個人事業主・中小企業のホームページ制作と内部SEO対策を専門とするデザインスタジオ。DTP・WEB合わせて実績300件以上。';
export const SITE_URL = 'https://sane-design.net';
export const SITE_NAME = 'SANE DESIGN';


export const NAV_LINKS = [
  { href: '/works/', label: 'Works' },
  { href: '/services/web-design/', label: 'Web Design' },
  { href: '/services/seo/', label: 'SEO' },
  { href: '/blog/', label: 'Journal' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
  { href: '/recruit/', label: 'Work Request' },
  { href: '/payment/', label: 'Order' },
];

// フッター用（ヘッダーを混雑させずFAQ等の補助ページを内部リンク・sitemapに含める）
export const FOOTER_LINKS = [
  ...NAV_LINKS,
  { href: '/faq/', label: 'FAQ' },
];
