export function generateOriginUrl(
  protocol: string,
  host: string,
  originalUrl: string
): string {
  return `${protocol}://${host}${originalUrl}`;
}
