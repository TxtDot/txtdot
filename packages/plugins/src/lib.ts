import * as engines from './engines';

export { engines };

export const engineList = [
  engines.StackOverflow,
  engines.SearX,
  engines.Readability,
];

import { compile } from 'html-to-text';

export const html2text = compile({
  selectors: [{ selector: 'img', format: 'skip' }],
});
