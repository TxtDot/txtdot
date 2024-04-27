import getConfig from '../config/main';
import { TxtDotError } from '@txtdot/sdk/dist/types/errors';

export class LocalResourceError extends TxtDotError {
  constructor() {
    super(403, 'LocalResourceError', 'Proxying local resources is forbidden.');
  }
}

export class UnsupportedMimetypeError extends TxtDotError {
  constructor(expected: string, got?: string) {
    super(
      415,
      'UnsupportedMimetypeError',
      `Unsupported mimetype, expected ${expected}, got ${got}`
    );
  }
}

export class NotHtmlMimetypeError extends TxtDotError {
  constructor() {
    super(
      421,
      'NotHtmlMimetypeError',
      'Received non-HTML content, ' +
        (getConfig().proxy.enabled
          ? 'use proxy instead of parser.'
          : 'proxying is disabled by the instance admin.')
    );
  }
}
