import { Readability as OReadability } from '@mozilla/readability';
import { Engine, EngineParseError, Route } from '@txtdot/sdk';

const Readability = new Engine(
  'Readability',
  'Engine for parsing content with Readability',
  ['*']
);

Readability.route('*path', async (input, ro: Route<{ path: string }>) => {
  const reader = new OReadability(input.document.cloneNode(true) as Document);
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
