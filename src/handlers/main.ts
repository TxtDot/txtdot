import axios from "../types/axios";
import { IHandlerOutput } from "./handler.interface";
import { readability } from "./readability";
import { JSDOM } from "jsdom";

type EngineFunction = (url: Document) => Promise<IHandlerOutput>;

export default async function handlePage(
  url: string,
  originalUrl: string,
  engine?: string
): Promise<IHandlerOutput> {
  if (engine && engineList.indexOf(engine) === -1) {
    throw new Error("Invalid engine");
  }

  const response = await axios.get(url);
  const document = new JSDOM(response.data, { url: url }).window.document;
  const UrlParsed = new URL(originalUrl);

  [...document.getElementsByTagName("a")].forEach((link) => {
    link.href = `${UrlParsed.origin}/?url=${link.href}${
      engine && `&engine=${engine}`
    }`;
  });

  if (engine) {
    return engines[engine](document);
  }

  const host = new URL(url).hostname;
  return fallback[host](document) || fallback["*"](document);
}

interface Engines {
  [key: string]: EngineFunction;
}

export const engines: Engines = {
  readability,
};

export const engineList: string[] = Object.keys(engines);

const fallback: Engines = {
  "*": engines.readability,
};
