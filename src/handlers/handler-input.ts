import { parseHTML } from "linkedom";

export class HandlerInput {
  private data: string;
  private url: string;
  private dom?: Window;

  constructor(data: string, url: string) {
    this.data = data;
    this.url = url;
  }

  getUrl(): string {
    return this.url;
  }

  parseDom(): Window {
    if (this.dom) {
      return this.dom;
    }

    this.dom = parseHTML(this.data);
    return this.dom;
  }
}
