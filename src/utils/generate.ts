export function generateRequestUrl(
  protocol: string,
  host: string,
  originalUrl: string
): URL {
  return new URL(`${protocol}://${host}${originalUrl}`);
}

export function generateProxyUrl(
  requestUrl: URL,
  href: string,
  engine?: string
): string {
  const parsedHref = new URL(href);
  const hrefWithoutHash = href.replace(parsedHref.hash, "");

  const urlParam = `?url=${encodeURIComponent(hrefWithoutHash)}`;
  const engineParam = engine ? `&engine=${engine}` : "";
  return `${requestUrl.origin}/get${urlParam}${engineParam}${parsedHref.hash}`;
}
