import axios from "../types/axios";
import { HandlerInput } from "./handler-input";
import { IHandlerOutput } from "./handler.interface";

import { Isolate, ExternalCopy, Callback, Context, Reference } from "isolated-vm";
import readability from "./readability";

export default async function readabilityWithJs(
  input: HandlerInput
): Promise<IHandlerOutput> {
  const window = input.parseDom().window;
  const js = window.document.getElementsByTagName("script");

  const ivm = new Isolate();
  const ctx = await ivm.createContext();
  for (let key in window) {
    if (key === "self") {
      continue;
    }
    const obj = window[key];
    // TODO: call copyIntoIsolate
    try {
      let copy;
      if (obj instanceof Function) {
        copy = new Callback(obj);
      }
      else {
        copy = new ExternalCopy(window[key]);
      }
      console.log(`OK ${key} f:${obj instanceof Function} o:${obj instanceof Object}`);
      ctx.global.set(key, copy);
    }
    catch (err) {
      console.log(`E ${key} f:${obj instanceof Function} o:${obj instanceof Object}`);
    }
  }

  for (const s of js) {
    if (s.src && s.src != "") {
      const req = await axios.get(s.src);
      ctx.eval(String(req.data));
    }
    else {
      ctx.eval(s.innerText);
    }
  }

  return readability(input);
}

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
// Impossible for this case...

function copyIntoIsolate(ref: Reference, key: string, obj: any) {
  if (obj instanceof Function) {
    ref.set(key, new Callback(obj));
    return;
  }

  if (obj instanceof Object) {
    ref.set(key, {});
    // Recursively call copyIntoIsolate
  }
}
