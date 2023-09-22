import { JSDOM } from "jsdom";
import { generateParserUrl, generateProxyUrl } from "./generate";
import getConfig from "../config/main";

export default function replaceHref(
  dom: JSDOM,
  requestUrl: URL,
  engine?: string,
  redirectPath: string = "get",
) {
  const bytag =
    (dom: JSDOM, tag: string) => dom.window.document.getElementsByTagName(tag);
  const bycss =
    (dom: JSDOM, css: string) => dom.window.document.querySelectorAll(css);

  const parserUrl = (href: string) => generateParserUrl(
    requestUrl,
    href,
    engine,
    redirectPath,
  );
  const proxyUrl = (href: string) => generateProxyUrl(
    requestUrl,
    href,
  );

  modifyLinks(
    bytag(dom, "a"),
    "href",
    parserUrl,
  );
  modifyLinks(
    bycss(dom, "frame,iframe"),
    "src",
    parserUrl,
  );

  if (getConfig().proxy_res) {
    modifyLinks(
      bycss(dom, "img,image,video,audio,embed,track,source"),
      "src",
      proxyUrl,
    );

    modifyLinks(
      bytag(dom, "object"),
      "data",
      proxyUrl,
    );

    const sources = bytag(dom, "source");
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
}

function modifyLinks(
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
