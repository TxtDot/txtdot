import { IHandlerOutput } from "./handler.interface";
import { Engines, EngineFunction, EnginesMatch } from "../types/handlers";
import axios from "../types/axios";

import micromatch from "micromatch";

import { JSDOM } from "jsdom";

import readability from "./readability";
import google, { GoogleDomains } from "./google";
import stackoverflow, { StackOverflowDomains } from "./stackoverflow/main";

import isLocalResource from "../utils/islocal";

import { LocalResourceError, NotHtmlMimetypeError } from "../errors/main";
import { HandlerInput } from "./handler-input";
import { Readable } from "stream";
import { decodeStream, parseEncodingName } from "../utils/http";
import replaceHref from "../utils/replace-href";

export default async function handlePage(
  url: string, // remote URL
  requestUrl: URL, // proxy URL
  engine?: string,
  redirectPath: string = "get",
): Promise<IHandlerOutput> {
  const urlObj = new URL(url);

  if (await isLocalResource(urlObj)) {
    throw new LocalResourceError();
  }

  const response = await axios.get(url);
  const data: Readable = response.data;
  const mime: string | undefined = response.headers["content-type"]?.toString();

  if (mime && mime.indexOf("text/html") === -1) {
    throw new NotHtmlMimetypeError();
  }

  const handler = getFallbackEngine(urlObj.hostname, engine);
  const output = await handler(
    new HandlerInput(
      await decodeStream(data, parseEncodingName(mime)),
      url,
    )
  );

  // post-process
  const dom = new JSDOM(output.content, { url });
  replaceHref(dom, requestUrl, engine, redirectPath);
  output.content = dom.serialize();
  // TODO: DomPurify

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
];
