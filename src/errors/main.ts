import getConfig from '../config/main';

export abstract class TxtDotError extends Error {
  code: number;
  name: string;
  description: string;

  constructor(code: number, name: string, description: string) {
    super(description);
    this.code = code;
    this.name = name;
    this.description = description;
  }
}

export class EngineParseError extends TxtDotError {
  constructor(message: string) {
    super(422, 'EngineParseError', `Parse error: ${message}`);
  }
}

export class NoHandlerFoundError extends TxtDotError {
  constructor(message: string) {
    super(404, 'NoHandlerFoundError', `No handler found for: ${message}`);
  }
}

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
