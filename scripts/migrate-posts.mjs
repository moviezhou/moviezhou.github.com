import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const postsDir = path.join(root, '_posts');
const outDir = path.join(root, 'src', 'content', 'blog');

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { meta: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: raw };
  const block = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\n/, '');
  const meta = {};
  let currentKey = '';
  let list = null;

  for (const line of block.split('\n')) {
    const cleanLine = line.replace(/\r$/, '');
    if (/^-\s+/.test(cleanLine) && currentKey && list) {
      list.push(cleanLine.replace(/^-\s+/, '').trim());
      continue;
    }
    const match = cleanLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    currentKey = key;
    if (value === '') {
      list = [];
      meta[key] = list;
      continue;
    }
    list = null;
    const valueClean = value.replace(/^['"]|['"]$/g, '');
    meta[key] = valueClean;
  }

  return { meta, body };
}

function normalizeTags(meta) {
  const tags = meta.tags;
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === 'string' && tags.trim()) return [tags.trim()];
  return [];
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
let migrated = 0;

for (const file of files) {
  const match = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) continue;

  const [, year, month, day, legacySlug] = match;
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const title = String(meta.title ?? legacySlug.replace(/-/g, ' '));
  const tags = normalizeTags(meta);
  const tagYaml = tags.length
    ? `tags:\n${tags.map((t) => `  - ${JSON.stringify(t)}`).join('\n')}`
    : 'tags: []';

  const out = `---
title: ${JSON.stringify(title)}
date: ${year}-${month}-${day}
legacySlug: ${JSON.stringify(legacySlug)}
${tagYaml}
---

${body.trimEnd()}
`;

  const outName = `${year}-${month}-${day}-${legacySlug}.md`;
  fs.writeFileSync(path.join(outDir, outName), out, 'utf8');
  migrated += 1;
}

const astroCache = path.join(root, '.astro');
if (fs.existsSync(astroCache)) {
  fs.rmSync(astroCache, { recursive: true, force: true });
  console.log('Cleared .astro content cache (restart dev server to see title changes)');
}

console.log(`Migrated ${migrated} posts to ${outDir}`);
