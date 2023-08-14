import axios from "../types/axios";
import { IHandlerOutput } from "./handler.interface";
import { readability } from "./readability";
import { JSDOM } from "jsdom";

type EngineFunction = (url: JSDOM) => Promise<IHandlerOutput>;

export default async function handlePage(
  url: string,
  engine?: string
): Promise<IHandlerOutput> {
  if (engine && engineList.indexOf(engine) === -1) {
    throw new Error("Invalid engine");
  }

  const response = await axios.get(url);
  const dom = new JSDOM(response.data, { url: url });

  if (engine) {
    return engines[engine](dom);
  }

  const host = new URL(url).hostname;
  return fallback[host](dom) || fallback["*"](dom);
}

interface Engines {
  [key: string]: EngineFunction;
}

export const engines: Engines = {
  readability: readability,
};

export const engineList: string[] = Object.keys(engines);

const fallback: Engines = {
  "*": engines.readability,
};
