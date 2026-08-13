/**
 * Cloudflare Pages Function — note.com RSS proxy
 * GET /api/note-rss  →  JSON array of note articles
 *
 * This runs on Cloudflare's edge so there are no CORS issues
 * when fetching from note.com. The blog page calls this endpoint
 * client-side so note articles are always fresh.
 */
export async function onRequestGet() {
  try {
    const rssRes = await fetch('https://note.com/sane_design2026/rss', {
      cf: { cacheTtl: 600 },           // edge-cache for 10 min
    });
    if (!rssRes.ok) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=600',
        },
      });
    }

    const rssText = await rssRes.text();
    const itemMatches = [...rssText.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    const articles = itemMatches.map((m) => {
      const item = m[1];
      const title = (item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '')
        .replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      const link = (item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '').trim();
      const pubDate = (item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '').trim();
      const thumbnail =
        (item.match(/<media:thumbnail[^>]*>([^<]+)<\/media:thumbnail>/)?.[1] || '').trim() ||
        (item.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] || '');
      const descRaw = (item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '')
        .replace(/<!\[CDATA\[|\]\]>/g, '');
      const description = descRaw.replace(/<[^>]+>/g, '').replace(/続きをみる$/, '').trim().slice(0, 100);

      return { title, link, pubDate, thumbnail, description };
    });

    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=600',
      },
    });
  } catch {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
