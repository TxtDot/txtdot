import { HandlerInput } from "../handlers/handler-input";
import { IHandlerOutput } from "../handlers/handler.interface";

export interface Engines {
  [key: string]: EngineFunction;
}

export type EngineMatch = {
  pattern: string | string[];
  engine: EngineFunction;
};

export type EngineFunction = (input: HandlerInput) => Promise<IHandlerOutput>;
export type EnginesMatch = EngineMatch[];
