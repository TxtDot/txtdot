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
    super(422, "EngineParseError", `Parse error: ${message}`);
  }
}

export class LocalResourceError extends TxtDotError {
  constructor() {
    super(403, "LocalResourceError", "Proxying local resources is forbidden.");
  }
}

export class NotHtmlMimetypeError extends Error {
  name: string = "NotHtmlMimetypeError";
  url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }
}
