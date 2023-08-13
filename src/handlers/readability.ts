import { Readability } from "@mozilla/readability";
import axios from "axios";
import { JSDOM } from "jsdom";
import { IHandlerOutput } from "./handler.interface";

export async function readability(url: string): Promise<IHandlerOutput> {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data, { url: url });
  const reader = new Readability(dom.window.document);
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
