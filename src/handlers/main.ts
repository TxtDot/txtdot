import { IHandlerOutput } from "./handler.interface";
import { readability } from "./readability";

export default function getCorrespondingReaderView(
  url: string
): Promise<IHandlerOutput> {
  const host = new URL(url).hostname;

  return fallback[host]?.(url) || fallback["*"](url);
}

const fallback: Fallback = {
  "*": readability,
};

interface Fallback {
  [host: string]: (url: string) => Promise<IHandlerOutput>;
}
