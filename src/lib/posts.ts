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
  url: process.env.ASTRO_SITE_URL ?? 'https://moviezhou.pages.dev',
};

export type BlogPost = CollectionEntry<'blog'>;

export interface TagSummary {
  slug: string;
  label: string;
  count: number;
}

const FILM_PATTERN = /film|movie|电影|影评|interstellar|truman|cove|楚门/i;

/**
 * Tag normalisation map: merge case variants, CJK/English synonyms, and
 * near-duplicates into a single canonical label. Keys are matched
 * case-insensitively against the raw tag string (trimmed).
 *
 * Only semantic merges belong here — "诗歌" and "Poem" mean the same thing,
 * but "梦" and "梦想" do not, so they stay separate.
 */
const TAG_ALIASES: Record<string, string> = {
  // ── CJK ↔ English synonyms ──────────────────────────────────────────
  '诗歌': '诗歌',
  'poem': '诗歌',
  'poems': '诗歌',
  '电影': '电影',
  'movie': '电影',
  'movies': '电影',
  '梦': '梦',
  'dream': '梦',
  'dreams': '梦',
  '梦境': '梦',
  '生活': '生活',
  'life': '生活',
  '音乐': '音乐',
  'music': '音乐',
  '摇滚': '摇滚',
  'rock': '摇滚',
  '算法': '算法',
  'algorithm': '算法',
  '经济学': '经济学',
  'economics': '经济学',
  '自由软件': '自由软件',
  'free software': '自由软件',
  '星座': '星座',
  'astrology': '星座',
  '巧合': '巧合',
  'coincidence': '巧合',
  '毕业': '毕业',
  'graduation': '毕业',
  '洛丽塔': '洛丽塔',
  'lolita': '洛丽塔',
  '阿凡达': '阿凡达',
  'avatar': '阿凡达',
  '计算机科学': '计算机科学',
  '计算机': '计算机科学',

  // ── Case normalisation (no semantic change) ────────────────────────
  'github': 'GitHub',
  'jekyll': 'Jekyll',
  'bluetooth': 'Bluetooth',
  'javascript': 'JavaScript',
  'python': 'Python',
  'emacs': 'Emacs',
  'ubuntu': 'Ubuntu',
  'eclipse': 'Eclipse',
  'oracle': 'Oracle',
  'ｕｆｏ': 'UFO',

  // ── Near-duplicate disambiguation (kept separate, not merged) ───────
  // "梦想" (aspiration) ≠ "梦" (dream)  — left as-is
  // "歌曲" (song) ≠ "音乐" (music)      — left as-is
};

/** Normalise a single raw tag into its canonical label. */
export function normaliseTag(raw: string): string {
  const key = raw.trim().toLowerCase();
  return TAG_ALIASES[key] ?? raw.trim();
}

/**
 * URL-safe, single-segment slug for a tag. Astro 6 routes can't carry a raw
 * `/` (or other URL-significant chars) in one dynamic segment, so collapse them
 * to hyphens. CJK and plain letters are kept readable. The original tag label
 * is passed via props for display/matching, so this need not be reversible.
 */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .replace(/[\s/\\%#?&]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function tagPath(slug: string): string {
  return slug ? `/tags/${slug}.html` : '/tags.html';
}

export function collectTags(posts: BlogPost[]): TagSummary[] {
  const map = new Map<string, TagSummary>();

  for (const post of posts) {
    // Deduplicate normalised tags within a single post (e.g. 诗歌 + Poem)
    const seen = new Map<string, string>(); // slug -> label
    for (const raw of post.data.tags ?? []) {
      const label = normaliseTag(raw);
      if (!label) continue;
      const slug = tagSlug(label);
      if (!seen.has(slug)) seen.set(slug, label);
    }
    for (const [slug, label] of seen) {
      const existing = map.get(slug);
      if (existing) existing.count += 1;
      else map.set(slug, { slug, label, count: 1 });
    }
  }

  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh'),
  );
}

export function postsForTag(posts: BlogPost[], label: string): BlogPost[] {
  const target = normaliseTag(label);
  return posts
    .filter((post) =>
      (post.data.tags ?? []).some((tag) => normaliseTag(tag) === target),
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getFilmPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter(
      (post) =>
        (post.data.tags ?? []).some((tag) => FILM_PATTERN.test(normaliseTag(tag))) ||
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

/** Raw-markdown twin of postPath, e.g. /2012/02/07/Pale-Fire.md (for LLM/agent use). */
export function postMarkdownPath(post: BlogPost): string {
  return postPath(post).replace(/\.html$/, '.md');
}

export function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
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
  const tag = normaliseTag(tags[0]);
  if (/code|javascript|web|tech|fedora|flask|nginx|linux|github|jekyll|python|emacs|ubuntu|eclipse|oracle|bluetooth|tcp\/ip|xna|win api|database|server/i.test(tag)) return 'Code';
  if (/film|movie|interstellar|review|电影|楚门|阿凡达|海豚湾|香港电影|塔可夫斯基/i.test(tag)) return 'Film';
  if (/poem|诗|诗歌/i.test(tag)) return 'Poem';
  if (/dream|梦|梦境/i.test(tag)) return 'Dream';
  if (/life|生活/i.test(tag)) return 'Life';
  if (/music|音乐|摇滚|民谣|歌曲/i.test(tag)) return 'Music';
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

/** Posts that share tags with `post`, then fill with recent entries if needed. */
export function relatedPosts(
  post: BlogPost,
  posts: BlogPost[],
  limit = 3,
): BlogPost[] {
  const currentTags = new Set(
    (post.data.tags ?? []).map((t) => normaliseTag(t)).filter(Boolean),
  );
  const pool = publishedPosts(posts).filter((p) => p.id !== post.id);

  const scored = pool.map((p) => {
    const overlap = (p.data.tags ?? []).filter((t) => currentTags.has(normaliseTag(t))).length;
    return { post: p, overlap };
  });

  scored.sort((a, b) => {
    if (b.overlap !== a.overlap) return b.overlap - a.overlap;
    return b.post.data.date.getTime() - a.post.data.date.getTime();
  });

  const picked: BlogPost[] = [];
  const seen = new Set<string>();
  for (const { post: candidate, overlap } of scored) {
    if (picked.length >= limit) break;
    if (overlap > 0 && !seen.has(candidate.id)) {
      picked.push(candidate);
      seen.add(candidate.id);
    }
  }
  for (const { post: candidate } of scored) {
    if (picked.length >= limit) break;
    if (!seen.has(candidate.id)) {
      picked.push(candidate);
      seen.add(candidate.id);
    }
  }
  return picked;
}

export function yearRange(posts: BlogPost[]): string {
  if (!posts.length) return '';
  const years = posts.map((p) => p.data.date.getFullYear());
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}
