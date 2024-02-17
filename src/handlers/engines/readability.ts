import { Readability } from '@mozilla/readability';
import { HandlerInput } from '../handler-input';
import { IHandlerOutput } from '../handler.interface';
import { EngineParseError } from '../../errors/main';

export default async function readability(
  input: HandlerInput
): Promise<IHandlerOutput> {
  const reader = new Readability(input.parseDom().window.document);
  const parsed = reader.parse();

  if (!parsed) {
    throw new EngineParseError('Failed to parse [readability]');
  }

  return {
    content: parsed.content,
    textContent: parsed.textContent,
    title: parsed.title,
    lang: parsed.lang,
  };
}
