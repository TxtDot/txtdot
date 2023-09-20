import { Script } from "vm";
import { HandlerInput } from "./handler-input";
import { IHandlerOutput } from "./handler.interface";
import readability from "./readability";

export default async function engineWithJsUnsafe(
  input: HandlerInput
): Promise<IHandlerOutput> {
  const dom = input.parseDom({
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
  });

  new Script("var globalThis = window").runInContext(dom.getInternalVMContext());

  return await readability(input);
}
