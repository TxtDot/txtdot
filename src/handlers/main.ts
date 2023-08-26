import { IHandlerOutput } from "./handler.interface";
import axios from "../types/axios";

import { JSDOM } from "jsdom";
import { DOMWindow } from "jsdom";

import readability from "./readability";
import google from "./google";
import stackoverflow from "./stackoverflow/main";

import { generateProxyUrl } from "../utils/generate";
import isLocalResource from "../utils/islocal";

import {
  LocalResourceError,
  NotHtmlMimetypeError,
} from "../errors/main";

export default async function handlePage(
  url: string, // remote URL
  requestUrl: URL, // proxy URL
  engine?: string,
  redirect_path: string = "get"
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
      link.href = generateProxyUrl(requestUrl, link.href, engine, redirect_path);
    } catch (_err) {
      // ignore TypeError: Invalid URL
    }
  });

  if (engine) {
    return engines[engine](window);
  }

  return fallback[urlObj.host]?.(window) || fallback["*"](window);
}

interface Engines {
  [key: string]: EngineFunction;
}

type EngineFunction = (window: DOMWindow) => Promise<IHandlerOutput>;

export const engines: Engines = {
  readability,
  google,
  stackoverflow,
};

export const engineList: string[] = Object.keys(engines);

const fallback: Engines = {
  "stackoverflow.com": engines.stackoverflow,
  "www.google.com": engines.google,
  "*": engines.readability,
};
