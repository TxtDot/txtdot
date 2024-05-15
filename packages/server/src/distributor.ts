import axios, { oaxios } from './types/axios';
import micromatch from 'micromatch';
import { Readable } from 'stream';
import { NotHtmlMimetypeError } from './errors/main';
import { decodeStream, parseEncodingName } from './utils/http';
import replaceHref from './utils/replace-href';

import { Engine, EngineOutput, Middleware } from '@txtdot/sdk';
import { HandlerInput, HandlerOutput } from '@txtdot/sdk';
import config from './config';
import { parseHTML } from 'linkedom';
import { html2text } from './utils/html2text';
import DOMPurify from 'isomorphic-dompurify';

interface IEngineId {
  [key: string]: number;
}

export class Distributor {
  engines_id: IEngineId = {};
  engines_fallback: Engine[] = [];
  engines_list: string[] = [];

  middles_id: IEngineId = {};
  middles_fallback: Middleware[] = [];
  middles_list: string[] = [];

  constructor() {}

  engine(engine: Engine) {
    this.engines_id[engine.name] = this.engines_list.length;
    this.engines_fallback.push(engine);
    this.engines_list.push(engine.name);
  }

  middleware(middleware: Middleware) {
    this.middles_id[middleware.name] = this.middles_list.length;
    this.middles_fallback.push(middleware);
    this.middles_list.push(middleware.name);
  }

  async handlePage(
    remoteUrl: string, // remote URL
    requestUrl: URL, // proxy URL
    engineName?: string,
    redirectPath: string = 'get'
  ): Promise<HandlerOutput> {
    const urlObj = new URL(remoteUrl);

    const webder_url = config.env.third_party.webder_url;

    const response = webder_url
      ? await oaxios.get(
          `${webder_url}/render?url=${encodeURIComponent(remoteUrl)}`
        )
      : await axios.get(remoteUrl);

    const data: Readable = response.data;
    const mime: string | undefined =
      response.headers['content-type']?.toString();

    if (mime && mime.indexOf('text/html') === -1) {
      throw new NotHtmlMimetypeError();
    }

    const engine = this.getFallbackEngine(urlObj.hostname, engineName);

    const input = new HandlerInput(
      await decodeStream(data, parseEncodingName(mime)),
      remoteUrl
    );

    let output = await engine.handle(input);

    // Sanitize output before middlewares, because middlewares can add unsafe tags
    output = {
      ...output,
      content: DOMPurify.sanitize(output.content),
    };

    output = await this.processMiddlewares(urlObj.hostname, input, output);

    const dom = parseHTML(output.content);

    // Get text content before link replacement, because in text format we need original links
    const stdTextContent = dom.document.documentElement.textContent;

    // post-process
    replaceHref(
      dom.document,
      requestUrl,
      new URL(remoteUrl),
      engineName,
      redirectPath
    );

    const title = output.title || dom.document.title;
    const lang = output.lang || dom.document.documentElement.lang;
    const textContent =
      html2text(stdTextContent, output, title) ||
      'Text output cannot be generated.';

    return {
      content: dom.document.toString(),
      textContent,
      title,
      lang,
    };
  }

  getFallbackEngine(host: string, specified?: string): Engine {
    if (specified) {
      return this.engines_fallback[this.engines_id[specified]];
    }

    for (const engine of this.engines_fallback) {
      if (micromatch.isMatch(host, engine.domains)) {
        return engine;
      }
    }

    return this.engines_fallback[0];
  }

  async processMiddlewares(
    host: string,
    input: HandlerInput,
    output: EngineOutput
  ): Promise<EngineOutput> {
    let processed_output = output;

    for (const middle of this.middles_fallback) {
      if (micromatch.isMatch(host, middle.domains)) {
        processed_output = await middle.handle(input, processed_output);
      }
    }

    return processed_output;
  }
}
