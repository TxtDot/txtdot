import { JSDOM } from "jsdom";
import { generateParserUrl, generateProxyUrl } from "../utils/generate";
import getConfig from "../config/main";

export class HandlerInput {
  private data: string;
  private url: string;
  private requestUrl: URL;
  private engine?: string;
  private redirectPath: string;
  private dom?: JSDOM;

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

  getUrl(): string {
    return this.url;
  }

  parseDom(): JSDOM {
    if (this.dom) {
      return this.dom;
    }

    this.dom = new JSDOM(this.data, { url: this.url });

    const bytag =
      (dom: JSDOM, tag: string) => dom.window.document.getElementsByTagName(tag);
    const bycss =
      (dom: JSDOM, css: string) => dom.window.document.querySelectorAll(css);

    const parserUrl = (href: string) => generateParserUrl(
      this.requestUrl,
      href,
      this.engine,
      this.redirectPath,
    );
    const proxyUrl = (href: string) => generateProxyUrl(
      this.requestUrl,
      href,
    );

    this.modifyLinks(
      bytag(this.dom, "a"),
      "href",
      parserUrl,
    );
    this.modifyLinks(
      bycss(this.dom, "frame,iframe"),
      "src",
      parserUrl,
    );

    if (getConfig().proxy_res) {
      this.modifyLinks(
        bycss(this.dom, "img,image,video,audio,embed,track,source"),
        "src",
        proxyUrl,
      );

      this.modifyLinks(
        bytag(this.dom, "object"),
        "data",
        proxyUrl,
      );

      const sources = bytag(this.dom, "source");
      for (const source of sources) {
        // split srcset by comma
        // @ts-ignore
        source.srcset = source.srcset.split(",").map(
          (src: string) => {
            // split src by space
            const parts = src.split(" ");
            try {
              // first part is URL
              parts[0] = proxyUrl(parts[0]);
            } catch (_err) { }
            // join by space after splitting
            return parts.join(" ");
          }
        ).join(","); // join by comma
      }
    }

    return this.dom;
  }

  private modifyLinks(
    nodeList: NodeListOf<Element> | HTMLCollectionOf<Element>,
    property: string,
    generateLink: (value: string) => string,
  ) {
    for (const node of nodeList) {
      try {
        // @ts-ignore
        node[property] = generateLink(node[property]);
      } catch (_err) { }
    }
  }
}
