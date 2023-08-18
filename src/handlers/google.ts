import { DOMWindow } from "jsdom";
import { IHandlerOutput } from "./handler.interface";
import { EngineParseError } from "../errors/main";

export default async function google(
  window: DOMWindow
): Promise<IHandlerOutput> {
  const googleAnchors = [
    ...window.document.querySelectorAll("a[jsname=ACyKwe]"),
  ] as HTMLAnchorElement[];

  const results = googleAnchors
    .map((a: HTMLAnchorElement): GoogleProps => {
      const parsedHref = new URL(new URL(a.href).searchParams.get("url")!);
      return {
        href: a.href!,
        siteName: parsedHref.hostname,
        heading: a.childNodes[1]?.textContent,
      };
    })
    .filter((a) => a.heading);

  if (!googleAnchors) {
    throw new EngineParseError(
      "Failed to find anchors in search result [google]"
    );
  }

  const convertToFormat = (result: GoogleProps, isHtml: boolean) => {
    return isHtml
      ? `<p><a href="${result.href}">${result.siteName} - ${result.heading}</p>`
      : `${result.siteName} - ${result.heading} > ${result.href}`;
  };

  const content = results.map((result) => {
    return convertToFormat(result, true);
  });

  const textContent = results.map((result) => {
    return convertToFormat(result, false);
  });

  const search = window.document.getElementById(
    "APjFqb"
  ) as HTMLTextAreaElement;

  const navLinks = [
    ...window.document.querySelectorAll(
      "table[class=AaVjTc] > tbody > tr > td > a"
    ),
  ].map((l) => {
    const link = l as HTMLAnchorElement;
    return `<td><a href="${link.href}">${link.innerHTML}</a></td>`;
  });

  const currPage =
    (window.document.querySelector(".YyVfkd") as HTMLTableCellElement)
      ?.cellIndex || 0;

  const pageTd = `<td>${currPage}</td>`;

  if (currPage === 1) navLinks.splice(currPage - 1, 0, pageTd);
  else if (currPage !== 0) navLinks.splice(currPage, 0, pageTd);

  const navigation = `<table>
    <tbody><tr>${navLinks.join("")}</tr></tbody>
  </table>`;

  const searchForm = `
  <form onsubmit="window.location.href = '/get?url=https://www.google.com/search?q='+ document.getElementById('q').value.split(' ').join('+'); return false">
    <input type="text" name="q" id="q" value="${search?.value}">
    <input type="button" value="Search" onclick="window.location.href = '/get?url=https://www.google.com/search?q='+ document.getElementById('q').value.split(' ').join('+');">
  </form>
  `;

  return {
    content: `${searchForm}${content.join("")}${navigation}`,
    textContent: textContent.join("\n"),
    title: window.document.title,
    lang: window.document.documentElement.lang,
  };
}

interface GoogleProps {
  href: string;
  siteName: string;
  heading: string | null;
}
