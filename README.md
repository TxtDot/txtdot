<h1 align="center">
  <a href="https://github.com/TxtDot/txtdot"><img src="https://github.com/TxtDot/.github/blob/main/imgs/TXTDot%20gh.png?raw=true" alt="txt." width="200"></a> <br>
  <img alt="GitHub" src="https://img.shields.io/github/license/txtdot/txtdot">
  <img alt="GitHub release (with filter)" src="https://img.shields.io/github/v/release/TxtDot/txtdot?display_name=release">
  <a href="https://matrix.to/#/#txtdot:matrix.org"><img alt="Static Badge" src="https://img.shields.io/badge/matrix_chat-green">
</a>

</h1>

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
