import { IHandlerOutput } from "./handler.interface";
import { readability } from "./readability";

export default function handlePage(
  url: string,
  engine?: string
): Promise<IHandlerOutput> {
  if (engine) {
    return engines[engine](url);
  }

  const host = new URL(url).hostname;
  return fallback[host]?.(url) || fallback["*"](url);
}

export const engines: Engines = {
  readability,
};

const fallback: Engines = {
  "*": engines.readability,
};
interface Engines {
  [host: string]: (url: string) => Promise<IHandlerOutput>;
}
