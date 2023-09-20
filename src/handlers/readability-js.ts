import axios from "../types/axios";
import { HandlerInput } from "./handler-input";
import { IHandlerOutput } from "./handler.interface";

import { Isolate, ExternalCopy, Callback } from "isolated-vm";
import readability from "./readability";

export default async function readabilityWithJs(
  input: HandlerInput
): Promise<IHandlerOutput> {
  const window = input.parseDom().window;
  const js = window.document.getElementsByTagName("script");

  const ivm = new Isolate();
  const ctx = await ivm.createContext();
  for (let key in window) {
    try {
      if (key === "self") {
        continue;
      }
      const obj = window[key];
      let copy;
      if (obj instanceof Function) {
        copy = new Callback(obj);
      }
      else {
        copy = new ExternalCopy(window[key]);
      }
      ctx.global.set(key, copy);
    }
    catch (err) { console.log("err: " + key); }
  }
  // ctx.global.set("window", new ExternalCopy(window)); // Don't know if passing JSDOM object is safe

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
