import { JSDOM } from "jsdom";

export class HandlerInput {
  private data: string;
  private url: string;
  private dom?: JSDOM;

  constructor(
    data: string,
    url: string,
  ) {
    this.data = data;
    this.url = url;
  }

  getUrl(): string {
    return this.url;
  }

  parseDom(): JSDOM {
    if (this.dom) {
      return this.dom;
    }

    this.dom = new JSDOM(this.data, { url: this.url });
    return this.dom;
  }
}
