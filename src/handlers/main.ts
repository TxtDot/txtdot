import { IHandlerOutput } from "./handler.interface";
import { readability } from "./readability";

type EngineFunction = (url: string) => Promise<IHandlerOutput>;

export default function handlePage(
  url: string,
  engine?: string
): Promise<IHandlerOutput> {
  if (engine && engineList.indexOf(engine) === -1) {
    throw new Error("Invalid engine");
  }

  if (engine) {
    return engines[engine](url);
  }

  const host = new URL(url).hostname;
  return fallback[host](url) || fallback["*"](url);
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
