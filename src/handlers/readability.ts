import { Readability } from "@mozilla/readability";
// import { JSDOM } from "jsdom";
import { IHandlerOutput } from "./handler.interface";

export async function readability(document: Document): Promise<IHandlerOutput> {
  const reader = new Readability(document);
  const parsed = reader.parse();

  if (!parsed) {
    throw new Error("Failed to parse [readability]");
  }

  return {
    content: parsed.content,
    textContent: parsed.textContent,
    title: parsed.title,
    lang: parsed.lang,
  };
}
