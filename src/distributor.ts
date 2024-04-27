import axios, { oaxios } from './types/axios';
import micromatch from 'micromatch';
import DOMPurify from 'dompurify';
import { Readable } from 'stream';
import { NotHtmlMimetypeError } from './errors/main';
import { decodeStream, parseEncodingName } from './utils/http';
import replaceHref from './utils/replace-href';
import { parseHTML } from 'linkedom';

import env_config from './config/envConfig';
import { Engine } from '@txtdot/sdk';
import { HandlerInput, IHandlerOutput } from '@txtdot/sdk/dist/types/handler';

interface IEngineId {
  [key: string]: number;
}

export class Distributor {
  engines_id: IEngineId = {};
  fallback: Engine[] = [];
  list: string[] = [];
  constructor() {}

  engine(engine: Engine) {
    this.engines_id[engine.name] = this.list.length;
    this.fallback.push(engine);
    this.list.push(engine.name);
  }

  async handlePage(
    remoteUrl: string, // remote URL
    requestUrl: URL, // proxy URL
    engineName?: string,
    redirectPath: string = 'get'
  ): Promise<IHandlerOutput> {
    const urlObj = new URL(remoteUrl);

    const webder_url = env_config.third_party.webder_url;

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
    const output = await engine.handle(
      new HandlerInput(
        await decodeStream(data, parseEncodingName(mime)),
        remoteUrl
      )
    );

    // post-process
    // TODO: generate dom in handler and not parse here twice
    const dom = parseHTML(output.content);
    replaceHref(dom, requestUrl, new URL(remoteUrl), engineName, redirectPath);

    const purify = DOMPurify(dom.window);
    output.content = purify.sanitize(dom.document.toString());

    return output;
  }

  getFallbackEngine(host: string, specified?: string): Engine {
    if (specified) {
      return this.fallback[this.engines_id[specified]];
    }

    for (const engine of this.fallback) {
      if (micromatch.isMatch(host, engine.domains)) {
        return engine;
      }
    }

    return this.fallback[0];
  }
}
