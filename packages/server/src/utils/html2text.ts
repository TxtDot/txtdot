import { EngineOutput } from '@txtdot/sdk/dist/types/handler';
import config from '../config';

export function html2text(output: EngineOutput, doc: Document) {
  if (output.textContent) return output.textContent;
  else if (config.plugin.html2text)
    return config.plugin.html2text(output.content);
  else return doc.documentElement.textContent;
}
