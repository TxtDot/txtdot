export class TxtDotError extends Error {
  code: number;
  description: string;

  constructor(code: number, description: string) {
    super(description);
    this.code = code;
    this.description = description;
  }
}

export class EngineParseError extends TxtDotError {
  constructor(message: string) {
    super(500, `Parse error: ${message}`);
  }
}

export class LocalResourceError extends TxtDotError {
  constructor() {
    super(403, "Proxying local resources is forbidden.");
  }
}

export class NotHtmlMimetypeError extends Error {
  url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }
}
