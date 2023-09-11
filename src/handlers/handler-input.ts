import { JSDOM } from "jsdom";
import { generateProxyUrl } from "../utils/generate";

export class HandlerInput {
  private data: string;
  private url: string;
  private requestUrl: URL;
  private engine?: string;
  private redirectPath: string;

  constructor(
    data: string,
    url: string,
    requestUrl: URL,
    engine?: string,
    redirectPath: string = "get",
  ) {
    this.data = data;
    this.url = url;
    this.requestUrl = requestUrl;
    this.engine = engine;
    this.redirectPath = redirectPath;
  }

  parseDom() {
    const dom = new JSDOM(this.data, { url: this.url });

    const links = dom.window.document.getElementsByTagName("a");
    for (const link of links) {
      try {
        link.href = generateProxyUrl(
          this.requestUrl,
          link.href,
          this.engine,
          this.redirectPath,
        );
      } catch (_err) {
        // ignore TypeError: Invalid URL
      }
    }
  }

  getUrl() {
    return this.url;
  }
}
