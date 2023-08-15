import { DOMWindow } from "jsdom";
import { IHandlerOutput } from "./handler.interface";

export default async function google(
  window: DOMWindow
): Promise<IHandlerOutput> {
  const searchEl = window.document.querySelectorAll(
    "#rso > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)"
  );

  if (!searchEl) {
    throw new Error("Failed to find search element [google]");
  }
  const results = [...searchEl];

  const content = results.map((result) => {
    const anchor = result as HTMLAnchorElement;
    const heading = anchor.childNodes[1] as HTMLHeadingElement;
    return `<p><a href="${anchor.href}">${heading.innerHTML}</p>`;
  });

  const searchForm = `
  <div id="searchform" method="get" id="searchform" method="get">
    <input type="text" name="q" id="q">
    <input type="button" value="Search" onclick="window.location.href = '/?url=https://www.google.com/search?q='+ document.getElementById('q').value.split(' ').join('+');">
  </div>
  `;

  return {
    content: `${searchForm}${content.join("")}`,
    textContent: "parsed.textContent",
    title: window.document.title,
    lang: "parsed.lang",
  };
}
