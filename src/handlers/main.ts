import { IHandlerOutput } from "./handler.interface";
import { Engines, EngineFunction, EnginesMatch } from "../types/handlers";
import axios from "../types/axios";

import micromatch from "micromatch";

import readability from "./readability";
import google, { GoogleDomains } from "./google";
import stackoverflow, { StackOverflowDomains } from "./stackoverflow/main";

import isLocalResource from "../utils/islocal";

import { LocalResourceError, NotHtmlMimetypeError } from "../errors/main";
import { HandlerInput } from "./handler-input";
import { Readable } from "stream";
import { decodeStream, parseEncodingName } from "../utils/http";

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
    throw new NotHtmlMimetypeError(url);
  }

  return getFallbackEngine(urlObj.hostname, engine)(
    new HandlerInput(
      await decodeStream(data, parseEncodingName(mime)),
      url,
      requestUrl,
      engine,
      redirectPath,
    )
  );
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
