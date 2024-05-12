import { parseHTML } from 'linkedom';
import { Engine } from '../engine';

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

export interface IHandlerOutput {
  content: string;
  textContent: string;
  title?: string;
  lang?: string;
}

export const handlerSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'string',
    },
    textContent: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    lang: {
      type: 'string',
    },
  },
};

export interface Engines {
  [key: string]: Engine;
}

export type EngineMatch<TParams extends RouteValues> = {
  pattern: string | string[];
  engine: EngineFunction<TParams>;
};

export interface RouteValues {
  [key: string]: string;
}

export type EngineFunction<TParams extends RouteValues> = (
  input: HandlerInput,
  ro: Route<TParams>
) => Promise<IHandlerOutput>;

export type EnginesMatch<TParams extends RouteValues> = EngineMatch<TParams>[];

export interface Route<TParams extends RouteValues> {
  q: TParams;
  reverse: (req: { [K in keyof TParams]: string | number | boolean }) =>
    | string
    | false;
}
