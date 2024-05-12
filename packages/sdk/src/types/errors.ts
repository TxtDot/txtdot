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

export class NoHandlerFoundError extends TxtDotError {
  constructor(message: string) {
    super(404, "NoHandlerFoundError", `No handler found for: ${message}`);
  }
}

export class EngineParseError extends TxtDotError {
  constructor(message: string) {
    super(422, "EngineParseError", `Parse error: ${message}`);
  }
}
