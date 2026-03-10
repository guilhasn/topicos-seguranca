import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Topicos de Seguranca',
  tagline: 'Materiais de apoio para as fichas praticas em C#',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://guilhasn.github.io',
  baseUrl: '/topicos-seguranca/',

  organizationName: 'guilhasn',
  projectName: 'topicos-seguranca',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'pt',
    locales: ['pt'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/guilhasn/topicos-seguranca/tree/main/docusaurus-site/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Topicos de Seguranca',
      logo: {
        alt: 'Topicos de Seguranca',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Materiais',
        },
        {to: '/docs/intro', label: 'Guia', position: 'left'},
        {
          href: 'https://github.com/guilhasn/topicos-seguranca',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introducao',
              to: '/docs/intro',
            },
            {
              label: 'Fichas praticas',
              to: '/docs/fichas/ficha-01',
            },
          ],
        },
        {
          title: 'Repositorio',
          items: [
            {
              label: 'Codigo e resolucoes',
              href: 'https://github.com/guilhasn/topicos-seguranca',
            },
          ],
        },
      ],
      copyright: `Copyright (c) ${new Date().getFullYear()} Topicos de Seguranca.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['csharp'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
