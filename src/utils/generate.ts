export function generateRequestUrl(
  protocol: string,
  host: string,
  originalUrl: string
): URL {
  return new URL(`${protocol}://${host}${originalUrl}`);
}

export function generateParserUrl(
  requestUrl: URL,
  href: string,
  engine?: string,
  redirect_url: string = 'get'
): string {
  const parsedHref = new URL(href);

  const hash = parsedHref.hash; // save #hash
  parsedHref.hash = ''; // remove

  const urlParam = `?url=${encodeURIComponent(parsedHref.toString())}`;
  const engineParam = engine ? `&engine=${engine}` : '';

  return `${requestUrl.origin}/${redirect_url}${urlParam}${engineParam}${hash}`;
}

export function generateProxyUrl(requestUrl: URL, href: string): string {
  const urlParam = `?url=${encodeURIComponent(href)}`;
  return `${requestUrl.origin}/proxy${urlParam}`;
}
