import { JSDOM } from "jsdom";
import { generateParserUrl, generateProxyUrl } from "./generate";
import getConfig from "../config/main";

export default function replaceHref(
  dom: JSDOM,
  requestUrl: URL,
  engine?: string,
  redirectPath: string = "get"
) {
  const doc = dom.window.document;
  const parserUrl = (href: string) =>
    href.startsWith("http")
      ? generateParserUrl(requestUrl, href, engine, redirectPath)
      : href;
  const proxyUrl = (href: string) =>
    href.startsWith("http") ? generateProxyUrl(requestUrl, href) : href;
  modifyLinks(doc.querySelectorAll("a[href]"), "href", parserUrl);
  modifyLinks(doc.querySelectorAll("frame,iframe"), "src", parserUrl);

  if (getConfig().proxy_res) {
    modifyLinks(
      doc.querySelectorAll("img,image,video,audio,embed,track,source"),
      "src",
      proxyUrl
    );

    modifyLinks(doc.getElementsByTagName("object"), "data", proxyUrl);
    const sources = doc.querySelectorAll("source,img");
    for (const source of sources) {
      // split srcset by comma
      // @ts-expect-error because I don't know what to do about it.
      if (!source.srcset) continue;
      // @ts-expect-error because I don't know what to do about it.
      source.srcset = source.srcset
        .split(",")
        .map((src: string) => {
          // split src by space
          const parts = src.trim().split(" ");
          try {
            // first part is URL
            // (srcset="http 200w 1x,...")
            parts[0] = proxyUrl(parts[0]);
          } catch (_err) {
            /* empty */
          }
          // join by space after splitting
          return parts.join(" ");
        })
        .join(","); // join by comma
    }
  }
}

function modifyLinks(
  nodeList: NodeListOf<Element> | HTMLCollectionOf<Element>,
  property: string,
  generateLink: (value: string) => string
) {
  for (const node of nodeList) {
    try {
      // @ts-expect-error because I don't know what to do about it.
      node[property] = generateLink(node[property]);
    } catch (_err) {
      /* empty */
    }
  }
}
