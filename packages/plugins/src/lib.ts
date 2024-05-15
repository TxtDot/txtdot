import * as engines from './engines';
export { engines };
export const engineList = [
  engines.StackOverflow,
  engines.SearX,
  engines.Readability,
];

import * as middlewares from './middlewares';
export { middlewares };
export const middlewareList = [middlewares.Highlight];

import { compile } from 'html-to-text';
export const html2text = compile({
  longWordSplit: {
    forceWrapOnLimit: true,
  },
  selectors: [{ selector: 'img', format: 'skip' }],
});
