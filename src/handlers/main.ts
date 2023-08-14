import { IHandlerOutput } from "./handler.interface";
import { readability } from "./readability";

export default function handlePage(url: string, engine: string): Promise<IHandlerOutput> {
  const func = engines[engine];
  if (!func) {
    throw new Error('No such engine')
  }

  return func(url)
}

export const engines: Engines = {
  "readability": readability,
};

interface Engines {
  [name: string]: (url: string) => Promise<IHandlerOutput>;
}

/*
const fallback: Engines = {
  "*": engines.readability,
};
interface Engines {
  [host: string]: (url: string) => Promise<IHandlerOutput>;
}
*/
