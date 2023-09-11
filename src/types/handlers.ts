import { DOMWindow } from "jsdom";
import { IHandlerOutput } from "../handlers/handler.interface";

export interface Engines {
  [key: string]: EngineFunction;
}

export type EngineMatch = {
  pattern: string | string[];
  engine: EngineFunction;
};

export type EngineFunction = (window: DOMWindow) => Promise<IHandlerOutput>;
export type EnginesMatch = EngineMatch[];
