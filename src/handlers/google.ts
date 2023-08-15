import { DOMWindow } from "jsdom";
import { IHandlerOutput } from "./handler.interface";

export default async function google(
  window: DOMWindow
): Promise<IHandlerOutput> {
  const googleAnchors = window.document.querySelectorAll(
    "#rso > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)"
  );

  if (!googleAnchors) {
    throw new Error("Failed to find anchors in search result [google]");
  }
  const results = [...googleAnchors];

  const convertToFormat = (result: Element, isHtml: boolean) => {
    const anchor = result as HTMLAnchorElement;
    const heading = anchor.childNodes[1] as HTMLHeadingElement;
    return isHtml
      ? `<p><a href="${anchor.href}">${heading.innerHTML}</p>`
      : `${heading.innerHTML} > ${anchor.href}`;
  };

  const content = results.map((result) => {
    return convertToFormat(result, true);
  });

  const textContent = results.map((result) => {
    return convertToFormat(result, false);
  });

  const searchForm = `
  <form onsubmit="window.location.href = '/?url=https://www.google.com/search?q='+ document.getElementById('q').value.split(' ').join('+'); return false">
    <input type="text" name="q" id="q">
    <input type="button" value="Search" onclick="window.location.href = '/?url=https://www.google.com/search?q='+ document.getElementById('q').value.split(' ').join('+');">
  </form>
  `;

  return {
    content: `${searchForm}${content.join("")}`,
    textContent: textContent.join("\n"),
    title: window.document.title,
    lang: window.document.documentElement.lang,
  };
}
