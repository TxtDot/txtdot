# txt.

HTTP proxy that parses only text, links and pictures from pages
reducing internet traffic, removing ads and heavy scripts.

## Installation

```bash
npm install
```

## Running

### Dev

```bash
npm run dev
```

### Prod

```bash
npm run build
npm run start
```

Uses [Mozilla's readability.js](https://github.com/mozilla/readability),
[JSDOM](https://github.com/jsdom/jsdom),
[Fastify web framework](https://github.com/fastify/fastify).
