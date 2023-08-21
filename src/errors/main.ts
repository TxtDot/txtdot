export class EngineParseError extends Error {}
export class InvalidParameterError extends Error {}
export class LocalResourceError extends Error {}

export class NotHtmlMimetypeError extends Error {
  url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
}

export interface IFastifyValidationError {
  statusCode: number;
  code: string;
  validation: any;
}
