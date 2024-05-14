import { EngineOutput } from '@txtdot/sdk/dist/types/handler';
import config from '../config';

function setTitle(body: string | null, title: string) {
  if (!body) return null;
  return `${title.toUpperCase()}\n${'='.repeat(title.length)}\n\n${body}`;
}

export function html2text(
  stdTextContent: string | null,
  output: EngineOutput,
  title: string
) {
  if (output.textContent) return output.textContent;
  else if (config.plugin.html2text)
    return setTitle(config.plugin.html2text(output.content), title);
  else return setTitle(stdTextContent, title);
}
