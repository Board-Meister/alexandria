import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Board Meister documentation',
  tagline: 'Read all on about Board Meister originals®',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://lib.boardmeister.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/Board-Meister/alexandria/blob/master/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/Board-Meister/alexandria/blob/master/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: [
            './src/css/custom.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'Board Meister',
      logo: {
        alt: 'Board Meister Logo',
        src: 'img/logo_small.png',
      },
      items: [
        {to: '/docs/category/marshal', label: 'Marshal', position: 'left'},
        {to: '/docs/category/herald', label: 'Herald', position: 'left'},
        {to: '/docs/category/dullahan', label: 'Dullahan', position: 'left'},
        {
          href: 'https://github.com/Board-Meister',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Boardmeister. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php', 'http', 'yaml', 'bash', 'json'],

    },
    colorMode: {
      defaultMode: 'dark',
    }
  } satisfies Preset.ThemeConfig,
};

export default config;
