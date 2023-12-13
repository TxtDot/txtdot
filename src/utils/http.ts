import { Readable } from 'stream';
import iconv from 'iconv-lite';

export async function decodeStream(
  data: Readable,
  charset: string = 'utf-8'
): Promise<string> {
  const strm = data.pipe(iconv.decodeStream(charset)) as IconvStream;
  return await new Promise((resolve) => {
    strm.collect((_err: Error, body: string) => {
      resolve(body);
    });
  });
}

export function parseEncodingName(ctype?: string): string {
  const match = ctype?.match(/charset=([A-Za-z0-9-]+)$/);
  if (!match) {
    return 'utf-8';
  }
  return match[1];
}

interface IconvStream extends NodeJS.ReadWriteStream {
  collect: (cb: (err: Error, body: string) => void) => void;
}
