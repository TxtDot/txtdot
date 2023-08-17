export function generateRequestUrl(
  protocol: string,
  host: string,
  originalUrl: string,
): URL {
  return new URL(`${protocol}://${host}${originalUrl}`);
}

export function generateProxyUrl(
  requestUrl: URL,
  href: string,
  engine?: string,
): string {
  const urlParam = `?url=${encodeURIComponent(href)}`;
  const engineParam = engine ? `&engine=${engine}` : "";
  // formatParam is not needed for now
  return requestUrl.origin + "/get" + urlParam + engineParam;
}
