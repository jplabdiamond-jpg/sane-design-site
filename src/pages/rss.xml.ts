import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';

export async function GET(context: any) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      ...(post.data.heroImage
        ? {
            customData: `<media:content url="${new URL(post.data.heroImage, SITE_URL).href}" medium="image" />`,
          }
        : {}),
    })),
    customData: `<language>ja</language>`,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
  });
}
