import Route from 'route-parser';
import { HandlerInput } from './handler-input';
import { IHandlerOutput } from './handler.interface';
import { EngineParseError } from '../errors/main';
import { EngineFunction } from '../types/handlers';

interface IRoute {
  route: Route;
  handler: EngineFunction;
}

export class Engine {
  name: string;
  domains: string[];
  routes: IRoute[] = [];
  constructor(name: string, domains: string[] = []) {
    this.domains = domains;
    this.name = name;
  }

  route(path: string, handler: EngineFunction) {
    this.routes.push({ route: new Route(path), handler: handler });
  }

  async handle(input: HandlerInput): Promise<IHandlerOutput> {
    const url = new URL(input.getUrl());
    const path = url.pathname + url.search + url.hash;
    for (const route of this.routes) {
      const match = route.route.match(path);

      if (match) {
        return await route.handler(input, match, route.route);
      }
    }

    throw new EngineParseError(`No handler for ${path}. [${this.name}]`);
  }
}
