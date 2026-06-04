import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, postPath, isoDate, type BlogPost } from '../../../../lib/posts';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => {
    const d = post.data.date;
    return {
      params: {
        year: String(d.getFullYear()),
        month: String(d.getMonth() + 1).padStart(2, '0'),
        day: String(d.getDate()).padStart(2, '0'),
        slug: post.data.legacySlug,
      },
      props: { post },
    };
  });
}

export const GET: APIRoute = ({ props }) => {
  const post = props.post as BlogPost;
  const url = new URL(postPath(post), SITE.url).href;
  const tags = post.data.tags?.length ? post.data.tags.join(', ') : '';

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(post.data.title)}`,
    `date: ${isoDate(post.data.date)}`,
    tags ? `tags: [${tags}]` : null,
    `source: ${url}`,
    `author: ${SITE.author}`,
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  const body = `${frontmatter}\n\n# ${post.data.title}\n\n${post.body ?? ''}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
