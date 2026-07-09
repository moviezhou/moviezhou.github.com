import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkPangu from 'remark-pangu';

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
  site: process.env.ASTRO_SITE_URL ?? 'https://moviezhou.pages.dev',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    format: 'file',
  },
  markdown: {
    remarkPlugins: [
      [
        remarkPangu,
        {
          inlineCode: false,
          link: true,
          image: true,
        },
      ],
    ],
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
