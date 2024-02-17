import { IHandlerOutput } from './handler.interface';
import { Engines, EngineFunction, EnginesMatch } from '../types/handlers';
import axios from '../types/axios';

import micromatch from 'micromatch';

import DOMPurify from 'dompurify';

import { Readable } from 'stream';

import readability from './engines/readability';
import google, { GoogleDomains } from './engines/google';
import stackoverflow, {
  StackOverflowDomains,
} from './engines/stackoverflow/main';
import searx, { SearxDomains } from './engines/searx';

import isLocalResource from '../utils/islocal';

import { LocalResourceError, NotHtmlMimetypeError } from '../errors/main';
import { HandlerInput } from './handler-input';
import { decodeStream, parseEncodingName } from '../utils/http';
import replaceHref from '../utils/replace-href';
import { parseHTML } from 'linkedom';

export default async function handlePage(
  remoteUrl: string, // remote URL
  requestUrl: URL, // proxy URL
  engine?: string,
  redirectPath: string = 'get'
): Promise<IHandlerOutput> {
  const urlObj = new URL(remoteUrl);

  if (await isLocalResource(urlObj)) {
    throw new LocalResourceError();
  }

  const response = await axios.get(remoteUrl);
  const data: Readable = response.data;
  const mime: string | undefined = response.headers['content-type']?.toString();

  if (mime && mime.indexOf('text/html') === -1) {
    throw new NotHtmlMimetypeError();
  }

  const handler = getFallbackEngine(urlObj.hostname, engine);
  const output = await handler(
    new HandlerInput(
      await decodeStream(data, parseEncodingName(mime)),
      remoteUrl
    )
  );

  // post-process

  const dom = parseHTML(output.content);
  replaceHref(dom, requestUrl, new URL(remoteUrl), engine, redirectPath);

  const purify = DOMPurify(dom.window);
  output.content = purify.sanitize(dom.document.toString());

  return output;
}

function getFallbackEngine(host: string, specified?: string): EngineFunction {
  if (specified) {
    return engines[specified];
  }
  for (const engine of fallback) {
    if (micromatch.isMatch(host, engine.pattern)) {
      return engine.engine;
    }
  }
  return engines.readability;
}

export const engines: Engines = {
  readability,
  google,
  stackoverflow,
  searx,
};

export const engineList: string[] = Object.keys(engines);

export const fallback: EnginesMatch = [
  {
    pattern: GoogleDomains,
    engine: engines.google,
  },
  {
    pattern: StackOverflowDomains,
    engine: engines.stackoverflow,
  },
  {
    pattern: SearxDomains,
    engine: engines.searx,
  },
];
