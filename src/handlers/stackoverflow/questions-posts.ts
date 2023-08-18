import { DOMWindow } from "jsdom";
import { IHandlerOutput } from "../handler.interface";
import postParser from "./post-parser";

export default async function qPostsHandler(
  window: DOMWindow
): Promise<IHandlerOutput> {
  const questionEl = window.document.getElementById("question");
  const question = postParser(questionEl);

  const title =
    window.document.querySelector(".question-hyperlink")?.innerHTML || "";

  const allAnswers = [...window.document.querySelectorAll(".answer")];

  const answers = allAnswers.map((a) => postParser(a));

  return {
    content: `${question}<hr>${answers.length} answers <hr>${answers.join(
      "<hr>"
    )}`,
    textContent: "question",
    title,
    lang: "en",
  };
}
