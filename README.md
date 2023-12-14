<h1 align="center">
  <a href="https://github.com/TxtDot/txtdot"><img src="https://github.com/TxtDot/.github/blob/main/imgs/TXTDot%20gh.png?raw=true" alt="txt." width="200"></a>
  <br>
  <a href="https://txtdot.github.io/documentation"><img alt="Documentation" src="https://img.shields.io/badge/Documentation-green"></a>
  <a href="https://github.com/TxtDot/instances"><img alt="Instances" src="https://img.shields.io/badge/Instances-green"></a>
  <br>
  <a href="https://github.com/TxtDot/txtdot/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/txtdot/txtdot?color=blue"></a>
  <a href="https://github.com/TxtDot/txtdot/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/TxtDot/txtdot?display_name=release"></a>
  <a href="https://matrix.to/#/#txtdot:matrix.org"><img alt="Matrix chat" src="https://img.shields.io/badge/chat-matrix-blue"></a>
</h1>

HTTP proxy that parses only text, links and pictures from pages
reducing internet traffic, removing ads and heavy scripts.

Uses [Mozilla's readability.js](https://github.com/mozilla/readability),
[🔗 linkedom](https://github.com/WebReflection/linkedom),
[Fastify web framework](https://github.com/fastify/fastify).

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

### Docker

```bash
docker compose build
docker compose up -d
```
