// import Route from 'route-parser';
import { Engine } from '../handlers/engine';
import { HandlerInput } from '../handlers/handler-input';
import { IHandlerOutput } from '../handlers/handler.interface';

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
