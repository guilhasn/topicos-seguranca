# Topicos de Seguranca - Site de apoio

Este projeto usa [Docusaurus](https://docusaurus.io/) para publicar materiais de apoio das fichas praticas da UC.

## Requisitos

- Node.js 20+
- npm 10+

## Executar localmente

```bash
npm install
npm start
```

O site abre em `http://localhost:3000/topicos-seguranca/`.

## Build de producao

```bash
npm run build
```

O output estatico fica em `build/`.

## Publicar no GitHub Pages

```bash
GIT_USER=guilhasn npm run deploy
```

Configuracao atual:
- `url`: `https://guilhasn.github.io`
- `baseUrl`: `/topicos-seguranca/`
- branch de deploy: `gh-pages`

## Estrutura sugerida

- `docs/intro.md`: guia geral
- `docs/metodologia.md`: formato comum para fichas
- `docs/fichas/ficha-01.md` ... `docs/fichas/ficha-09.md`: conteudo por ficha
