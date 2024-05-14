import { Readability as OReadability } from '@mozilla/readability';

import { Engine, EngineParseError } from '@txtdot/sdk';
import { parseHTML } from 'linkedom';

const Readability = new Engine(
  'Readability',
  'Engine for parsing content with Readability',
  ['*']
);

Readability.route('*path', async (input, ro) => {
  const reader = new OReadability(input.document);
  const parsed = reader.parse();

  if (!parsed) {
    throw new EngineParseError(`(${ro.q.path}). [${Readability.name}]`);
  }

  return {
    content: parsed.content,
    title: parsed.title,
    lang: parsed.lang,
  };
});

export default Readability;
