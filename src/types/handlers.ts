import Route from 'route-parser';
import { Engine } from '../handlers/engine';
import { HandlerInput } from '../handlers/handler-input';
import { IHandlerOutput } from '../handlers/handler.interface';

export interface Engines {
  [key: string]: Engine;
}

export type EngineMatch = {
  pattern: string | string[];
  engine: EngineFunction;
};

export interface RouteValues {
  [key: string]: string;
}

export type EngineFunction = (
  input: HandlerInput,
  req: RouteValues,
  ro: Route
) => Promise<IHandlerOutput>;
export type EnginesMatch = EngineMatch[];
