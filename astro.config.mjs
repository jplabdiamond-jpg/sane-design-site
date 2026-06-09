import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://sane-design.net',
  integrations: [
    mdx(),
    sitemap({
      // noindexページ（管理画面・決済完了）をsitemapから除外
      filter: (page) =>
        !page.includes('/admin') && !page.includes('/payment/success'),
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        // 主要導線ページの優先度を引き上げ
        if (item.url === 'https://sane-design.net/') item.priority = 1.0;
        else if (
          item.url.includes('/works') ||
          item.url.includes('/services/') ||
          item.url.includes('/contact') ||
          item.url.includes('/faq')
        )
          item.priority = 0.9;
        else item.priority = 0.7;
        return item;
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
