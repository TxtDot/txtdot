import Route from 'route-parser';
import { HandlerInput } from './handler-input';
import { IHandlerOutput } from './handler.interface';
import { EngineParseError } from '../errors/main';
import { EngineFunction, RouteValues } from '../types/handlers';

interface IRoute<TParams extends RouteValues> {
  route: Route;
  handler: EngineFunction<TParams>;
}

export class Engine {
  name: string;
  domains: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: IRoute<any>[] = [];
  constructor(name: string, domains: string[] = []) {
    this.domains = domains;
    this.name = name;
  }

  route<TParams extends RouteValues>(
    path: string,
    handler: EngineFunction<TParams>
  ) {
    this.routes.push({ route: new Route<TParams>(path), handler });
  }

  async handle(input: HandlerInput): Promise<IHandlerOutput> {
    const url = new URL(input.getUrl());
    const path = url.pathname + url.search + url.hash;
    for (const route of this.routes) {
      const match = route.route.match(path);

      if (match) {
        return await route.handler(input, {
          q: match,
          reverse: (req) => route.route.reverse(req),
        });
      }
    }

    throw new EngineParseError(`No handler for ${path}. [${this.name}]`);
  }
}
