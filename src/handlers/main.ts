import { IHandlerOutput } from "./handler.interface";
import { readability } from "./readability";

type EngineFunction = (url: string) => Promise<IHandlerOutput>

export default function handlePage(url: string, engine?: string): Promise<IHandlerOutput> {
  let func: EngineFunction | undefined = engines[engine || ""];

  if (func === undefined) {
    const host = new URL(url).hostname;
    func = fallback[host] || fallback["*"];
  }

  return func(url);
}

interface Engines {
  [key: string]: EngineFunction;
}

export const engines: Engines = {
  "readability": readability,
};

const fallback: Engines = {
  "*": engines.readability,
};
