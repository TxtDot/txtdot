export default function postParser(el: Element | null): string {
  if (!el) {
    return "";
  }
  const body = el.querySelector(".js-post-body")?.innerHTML || "";
  const voteCount = el.querySelector(".js-vote-count")?.textContent || "";

  return `<h3>${voteCount} votes</h3>${body}`;
}
