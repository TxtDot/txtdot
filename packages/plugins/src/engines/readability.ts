import { Readability as OReadability } from '@mozilla/readability';
import { EngineParseError } from '@txtdot/sdk/dist/types/errors';

import { Engine } from '@txtdot/sdk';

const Readability = new Engine(
  'Readability',
  'Engine for parsing content with Readability',
  ['*']
);

Readability.route('*path', async (input, ro) => {
  const reader = new OReadability(input.parseDom().window.document);
  const parsed = reader.parse();

  if (!parsed) {
    throw new EngineParseError(`(${ro.q.path}). [${Readability.name}]`);
  }

  return {
    content: parsed.content,
    textContent: parsed.textContent,
    title: parsed.title,
    lang: parsed.lang,
  };
});

export default Readability;
