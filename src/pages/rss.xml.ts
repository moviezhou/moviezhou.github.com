import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, postPath, cjkSpacing } from '../lib/posts';

export async function GET(context: { site: URL | undefined }) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? 'https://moviezhou.github.io',
    items: posts.map((post) => ({
      title: cjkSpacing(post.data.title),
      pubDate: post.data.date,
      link: postPath(post),
    })),
  });
}
