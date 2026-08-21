// トップページ用データ取得（日本語版・英語版で共通利用）。
import { getCollection } from 'astro:content';

export type TopArticle = {
  type: 'internal' | 'note';
  title: string;
  link: string;
  pubDate: Date;
  heroImage: string;
};

export async function getLatestPosts(): Promise<TopArticle[]> {
  const allBlogPosts = await getCollection('blog', ({ data }) => !data.draft);

  // note RSS 取得（ビルド時）
  let noteArticles: { title: string; link: string; pubDate: string; thumbnail: string }[] = [];
  try {
    const rssRes = await fetch('https://note.com/sane_design2026/rss');
    const rssText = await rssRes.text();
    const itemMatches = [...rssText.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    noteArticles = itemMatches.map((m) => {
      const item = m[1];
      const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() ?? '';
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? '';
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';
      const thumbnail = item.match(/<media:thumbnail[^>]*>([^<]+)<\/media:thumbnail>/)?.[1]?.trim() ?? item.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] ?? '';
      return { title, link, pubDate, thumbnail };
    });
  } catch {}

  const latestPosts: TopArticle[] = [
    ...allBlogPosts.map((post) => ({
      type: 'internal' as const,
      title: post.data.title,
      link: `/blog/${post.slug}/`,
      pubDate: new Date(post.data.pubDate),
      heroImage: post.data.heroImage ?? '',
    })),
    ...noteArticles.map((a) => ({
      type: 'note' as const,
      title: a.title,
      link: a.link,
      pubDate: new Date(a.pubDate),
      heroImage: a.thumbnail,
    })),
  ]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 3);

  return latestPosts;
}

// トップページ用 OfferCatalog 構造化データ
export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Sane Design サービス一覧',
  itemListElement: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'ホームページ制作',
        description: 'レスポンシブ対応・SEO内部対策込みのホームページを最速3日で制作',
        url: 'https://sane-design.net/services/web-design/',
        provider: { '@id': 'https://sane-design.net/#organization' },
      },
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '20000',
        priceCurrency: 'JPY',
        minPrice: '20000',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'SEO対策',
        description: '内部SEO対策と指定キーワードに基づくブログ記事追加',
        url: 'https://sane-design.net/services/seo/',
        provider: { '@id': 'https://sane-design.net/#organization' },
      },
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '10000',
        priceCurrency: 'JPY',
        minPrice: '10000',
      },
    },
  ],
};
