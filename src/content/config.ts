import { defineCollection, z } from 'astro:content';

const works = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    // 英語版メタ（任意）。一覧・詳細ヘッダーの英語表示に使用。
    title_en: z.string().optional(),
    client_en: z.string().optional(),
    industry_en: z.string().optional(),
    year: z.coerce.number(),
    thumbnail: z.string(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    role: z.string().optional(),
    url: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
    noLink: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // AEO用: AIが引用しやすい一問一答（任意）。指定するとFAQ表示＋FAQPage JSON-LDを自動出力
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .optional(),
  }),
});

export const collections = { works, blog };
