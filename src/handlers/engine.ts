import Route from 'route-parser';
import { HandlerInput } from './handler-input';
import { IHandlerOutput } from './handler.interface';
import { EngineParseError } from '../errors/main';
import { EngineFunction } from '../types/handlers';

interface IRoutes {
  route: Route;
  handler: EngineFunction;
}

export class Engine {
  name: string;
  domains: string[];
  routes: IRoutes[] = [];
  constructor(name: string, domains: string[]) {
    this.domains = domains;
    this.name = name;
  }

  route(path: string, handler: EngineFunction) {
    this.routes.push({ route: new Route(path), handler: handler });
  }

  async handle(input: HandlerInput): Promise<IHandlerOutput> {
    for (const route of this.routes) {
      const match = route.route.match(input.getUrl());

      if (match) {
        return await route.handler(input);
      }
    }
    throw new EngineParseError('No route found');
  }
}
