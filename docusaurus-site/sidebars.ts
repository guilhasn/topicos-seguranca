import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'metodologia',
    'fundamentos-csharp',
    {
      type: 'category',
      label: 'Fichas Praticas',
      items: [
        'fichas/ficha-01',
        'fichas/ficha-02',
        'fichas/ficha-03',
        'fichas/ficha-04',
        'fichas/ficha-05',
        'fichas/ficha-06',
        'fichas/ficha-07',
        'fichas/ficha-08',
        'fichas/ficha-09',
      ],
    },
  ],
};

export default sidebars;
