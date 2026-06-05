import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  SITE,
  postPath,
  postMarkdownPath,
  publishedPosts,
  isoDate,
} from '../lib/posts';

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL(SITE.url)).origin;
  const posts = publishedPosts(await getCollection('blog')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  const abs = (path: string) => `${origin}${path}`;

  const postLines = posts.map((post) => {
    const md = abs(postMarkdownPath(post));
    const tags = post.data.tags?.length ? ` (${post.data.tags.join(', ')})` : '';
    return `- [${post.data.title}](${md}): ${isoDate(post.data.date)}${tags}`;
  });

  const pageLines = [
    `- [About](${abs('/about.html')}): 关于作者与博客`,
    `- [Movies](${abs('/movies.html')}): 电影与影评索引`,
    `- [Tags](${abs('/tags.html')}): 全部主题标签`,
    `- [Links](${abs('/links.html')}): 友链`,
  ];

  const text = [
    `# ${SITE.author}`,
    '',
    `> ${SITE.description}. 这是一个自 ${SITE.since} 年持续写作的个人博客，内容为中英文混排的随笔、诗歌与影评。每篇文章都提供 Markdown 原文（链接指向 .md 版本），便于人类读者或经授权的 Agent 按需引用。`,
    '',
    '## Policy',
    '',
    '- 本站内容为作者手写的个人文字，**不得用于大模型训练或批量语料采集**。',
    '- robots.txt 已拒绝常见 AI 训练爬虫（GPTBot、Google-Extended、CCBot 等）。',
    '- 允许常规搜索引擎索引；引用请注明出处与链接。',
    '',
    '## Posts',
    '',
    ...postLines,
    '',
    '## Pages',
    '',
    ...pageLines,
    '',
    '## Notes',
    '',
    `- 站点首页：${abs('/')}`,
    `- RSS：${abs('/rss.xml')}`,
    `- HTML 文章链接形如 ${abs('/YYYY/MM/DD/slug.html')}，对应 Markdown 原文将 .html 改为 .md。`,
    '',
  ].join('\n');

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
