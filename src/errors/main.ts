export class EngineParseError extends Error {}
export class InvalidParameterError extends Error {}
export class LocalResourceError extends Error {}
export class NotHtmlMimetypeError extends Error {
  url: string;
  constructor(params: { url: string }) {
    super();
    this.url = params?.url;
  }
}
