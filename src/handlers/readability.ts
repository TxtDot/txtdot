import { Readability } from "@mozilla/readability";
import { IHandlerOutput } from "./handler.interface";
import { DOMWindow } from "jsdom";
import { EngineParseError } from "../errors";

export default async function readability(
  window: DOMWindow
): Promise<IHandlerOutput> {
  const reader = new Readability(window.document);
  const parsed = reader.parse();

  if (!parsed) {
    throw new EngineParseError("Failed to parse [readability]");
  }

  return {
    content: parsed.content,
    textContent: parsed.textContent,
    title: parsed.title,
    lang: parsed.lang,
  };
}
