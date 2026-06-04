export interface ExternalLink {
  title: string;
  url: string;
  description: string;
}

export const EXTERNAL_LINKS: ExternalLink[] = [
  {
    title: '豆瓣',
    url: 'https://www.douban.com/people/moviezhou/',
    description: 'moviezhou 的豆瓣主页 · 书影音记录',
  },
  {
    title: 'GitHub',
    url: 'https://github.com/moviezhou',
    description: '代码仓库与开源项目',
  },
  {
    title: 'RSS',
    url: '/rss.xml',
    description: '订阅博客更新',
  },
];
