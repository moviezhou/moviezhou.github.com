import type { CollectionEntry } from 'astro:content';
import pangu from 'pangu';

/** 盘古之白：中英文混排自动加空格（用于模板中的标题、标签等） */
export function cjkSpacing(text: string): string {
  if (!text?.trim()) return text;
  return pangu.spacing(text);
}

export const SITE = {
  name: "What's Eating Gilbert Grape",
  author: 'moviezhou',
  description:
    'moviezhou 的个人博客 · 随笔、诗歌、影评 · since 2009',
  since: 2009,
  url: 'https://moviezhou.github.io',
};

export type BlogPost = CollectionEntry<'blog'>;

export interface TagSummary {
  slug: string;
  label: string;
  count: number;
}

const FILM_PATTERN = /film|movie|电影|影评|interstellar|truman|cove|楚门/i;

export function tagSlug(tag: string): string {
  return encodeURIComponent(tag.trim());
}

export function tagFromSlug(slug: string): string {
  return decodeURIComponent(slug);
}

export function tagPath(slug: string): string {
  return slug ? `/tags/${slug}.html` : '/tags.html';
}

export function collectTags(posts: BlogPost[]): TagSummary[] {
  const map = new Map<string, TagSummary>();

  for (const post of posts) {
    for (const raw of post.data.tags ?? []) {
      const label = raw.trim();
      if (!label) continue;
      const slug = tagSlug(label);
      const existing = map.get(slug);
      if (existing) existing.count += 1;
      else map.set(slug, { slug, label, count: 1 });
    }
  }

  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh'),
  );
}

export function postsForTag(posts: BlogPost[], slug: string): BlogPost[] {
  return posts
    .filter((post) =>
      (post.data.tags ?? []).some((tag) => tagSlug(tag) === slug),
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getFilmPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter(
      (post) =>
        (post.data.tags ?? []).some((tag) => FILM_PATTERN.test(tag)) ||
        FILM_PATTERN.test(post.data.title),
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function publishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => !post.data.title.startsWith('draft'));
}

export function postPath(post: BlogPost): string {
  const d = post.data.date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `/${y}/${m}/${day}/${post.data.legacySlug}.html`;
}

export function formatPostDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y} · ${m} · ${day}`;
}

export function formatListDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${m} · ${day}`;
}

export function primaryTag(tags: string[] = []): string {
  if (!tags.length) return 'Essay';
  const tag = tags[0];
  if (/code|javascript|web|tech|fedora|flask|nginx/i.test(tag)) return 'Code';
  if (/film|movie|interstellar|review/i.test(tag)) return 'Film';
  if (/poem|诗/i.test(tag)) return 'Poem';
  if (/dream/i.test(tag)) return 'Dream';
  if (/life/i.test(tag)) return 'Life';
  return tag.split(/\s+/)[0].slice(0, 12);
}

export function groupPostsByYear(posts: BlogPost[]): Map<number, BlogPost[]> {
  const sorted = [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const groups = new Map<number, BlogPost[]>();
  for (const post of sorted) {
    const year = post.data.date.getFullYear();
    const list = groups.get(year) ?? [];
    list.push(post);
    groups.set(year, list);
  }
  return groups;
}

export interface ReadingStats {
  words: number;
  minutes: number;
}

/**
 * Estimate reading length from raw markdown body.
 * CJK characters are counted individually (~400/min); Latin runs as words
 * (~220/min). Code blocks, inline code, image and link URLs are stripped.
 */
export function readingStats(body: string): ReadingStats {
  const text = (body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|\-]+/g, ' ');

  const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z0-9]+/g) ?? []).length;
  const words = cjk + latin;
  const minutes = Math.max(1, Math.round(cjk / 400 + latin / 220));
  return { words, minutes };
}

export function yearRange(posts: BlogPost[]): string {
  if (!posts.length) return '';
  const years = posts.map((p) => p.data.date.getFullYear());
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}
