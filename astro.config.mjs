import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

function rehypeLazyImages() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'img') return;
      node.properties ??= {};
      if (!node.properties.loading) node.properties.loading = 'lazy';
      if (!node.properties.decoding) node.properties.decoding = 'async';
    });
  };
}

function walk(node, visit) {
  visit(node);
  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) walk(child, visit);
  }
}

export default defineConfig({
  site: 'https://moviezhou.github.io',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    format: 'file',
  },
  markdown: {
    rehypePlugins: [rehypeLazyImages],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
