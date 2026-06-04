import fs from 'node:fs';
import path from 'node:path';

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { meta: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: raw, error: 'no end' };
  const block = raw.slice(3, end).trim();
  const meta = {};
  let currentKey = '';
  let list = null;

  for (const line of block.split('\n')) {
    const clean = line.replace(/\r$/, '');
    if (/^-\s+/.test(clean) && currentKey && list) {
      list.push(clean.replace(/^-\s+/, '').trim());
      continue;
    }
    const match = clean.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    currentKey = key;
    if (value === '') {
      list = [];
      meta[key] = list;
      continue;
    }
    list = null;
    meta[key] = value.replace(/^['"]|['"]$/g, '');
  }

  return { meta };
}

const samples = [
  '_posts/2021-11-17-old-blogs.md',
  '_posts/2012-05-25-reading-schedual.md',
  '_posts/2012-06-17-whats-wrong-man.md',
  '_posts/2014-11-13-Review-of-Interstellar.md',
];

for (const f of samples) {
  const raw = fs.readFileSync(f, 'utf8');
  const { meta, error } = parseFrontmatter(raw);
  console.log(f, error ?? meta.title ?? '(no title)');
}
