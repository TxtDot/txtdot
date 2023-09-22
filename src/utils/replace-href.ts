import { JSDOM } from "jsdom";
import { generateParserUrl, generateProxyUrl } from "./generate";
import getConfig from "../config/main";

export default function replaceHref(
  dom: JSDOM,
  requestUrl: URL,
  engine?: string,
  redirectPath: string = "get",
) {
  const doc = dom.window.document;

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
    doc.getElementsByTagName("a"),
    "href",
    parserUrl,
  );
  modifyLinks(
    doc.querySelectorAll("frame,iframe"),
    "src",
    parserUrl,
  );

  if (getConfig().proxy_res) {
    modifyLinks(
      doc.querySelectorAll("img,image,video,audio,embed,track,source"),
      "src",
      proxyUrl,
    );

    modifyLinks(
      doc.getElementsByTagName("object"),
      "data",
      proxyUrl,
    );

    const sources = doc.querySelectorAll("source,img");
    for (const source of sources) {
      // split srcset by comma
      // @ts-ignore
      if (!source.srcset)
        continue;
      // @ts-ignore
      source.srcset = source.srcset.split(",").map(
        (src: string) => {
          // split src by space
          const parts = src.trim().split(" ");
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
