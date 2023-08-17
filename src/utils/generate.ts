export function generateRequestUrl(
  protocol: string,
  host: string,
  originalUrl: string
): URL {
  return new URL(`${protocol}://${host}${originalUrl}`);
}

export function generateProxyUrl(href: string, engine?: string): string {
  const urlParam = `?url=${encodeURIComponent(href)}`;
  const engineParam = engine ? `&engine=${engine}` : "";
  return `/get${urlParam}${engineParam}`;
}
