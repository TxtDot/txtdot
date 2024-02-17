import { Readability } from '@mozilla/readability';
import { EngineParseError } from '../../errors/main';

import { Engine } from '../engine';

const ReadabilityEngine = new Engine('Readability');

ReadabilityEngine.route('*path', async (input, req) => {
  const reader = new Readability(input.parseDom().window.document);
  const parsed = reader.parse();

  if (!parsed) {
    throw new EngineParseError(
      `Parse error (${req.path}). [${ReadabilityEngine.name}]`
    );
  }

  return {
    content: parsed.content,
    textContent: parsed.textContent,
    title: parsed.title,
    lang: parsed.lang,
  };
});

export default ReadabilityEngine;
