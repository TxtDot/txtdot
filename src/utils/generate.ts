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

  const hash = parsedHref.hash;  // save #hash
  parsedHref.hash = "";  // remove

  const urlParam = `?url=${encodeURIComponent(parsedHref.toString())}`;
  const engineParam = engine ? `&engine=${engine}` : "";

  return `${requestUrl.origin}/get${urlParam}${engineParam}${hash}`;
}
