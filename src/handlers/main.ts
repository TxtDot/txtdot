import { IHandlerOutput } from "./handler.interface";
import axios from "../types/axios";

import { JSDOM } from "jsdom";
import { DOMWindow } from "jsdom";

import micromatch from "micromatch";

import readability from "./readability";
import google, { GoogleDomains } from "./google";
import stackoverflow, { StackOverflowDomains } from "./stackoverflow/main";

import { generateProxyUrl } from "../utils/generate";
import isLocalResource from "../utils/islocal";

import { LocalResourceError, NotHtmlMimetypeError } from "../errors/main";

export default async function handlePage(
  url: string, // remote URL
  requestUrl: URL, // proxy URL
  engine?: string,
  redirect_path: string = "get",
): Promise<IHandlerOutput> {
  const urlObj = new URL(url);

  if (await isLocalResource(urlObj)) {
    throw new LocalResourceError();
  }

  const response = await axios.get(url);
  const mime: string | undefined = response.headers["content-type"]?.toString();

  if (mime && mime.indexOf("text/html") === -1) {
    throw new NotHtmlMimetypeError(url);
  }

  const window = new JSDOM(response.data, { url }).window;

  [...window.document.getElementsByTagName("a")].forEach((link) => {
    try {
      link.href = generateProxyUrl(
        requestUrl,
        link.href,
        engine,
        redirect_path,
      );
    } catch (_err) {
      // ignore TypeError: Invalid URL
    }
  });

  return getFallbackEngine(urlObj.hostname, engine)(window);
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

interface Engines {
  [key: string]: EngineFunction;
}

export const engines: Engines = {
  readability,
  google,
  stackoverflow,
};

type EngineFunction = (window: DOMWindow) => Promise<IHandlerOutput>;
export type EngineMatch = {
  pattern: string | string[];
  engine: EngineFunction;
};
export type EnginesMatch = EngineMatch[];

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
];
