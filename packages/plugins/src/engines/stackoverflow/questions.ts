import { HandlerInput, Route } from '@txtdot/sdk';
import { parseHTML } from 'linkedom';

async function questions(
  input: HandlerInput,
  ro: Route<{ id: string; slug: string }>
) {
  const document = input.document;

  const questionEl = document.getElementById('question');
  const question = postParser(questionEl);

  const title = document.querySelector('.question-hyperlink')?.innerHTML || '';

  const allAnswers = [...document.querySelectorAll('.answer')];
  const answers = allAnswers.map((a) => postParser(a));

  return {
    content: `${question}<hr>${answers.length} answers <hr>${answers.join('<hr>')}`,
    textContent: `${ro.q.id}/${ro.q.slug}\nText output not supported`, // TODO
    title,
    lang: document.documentElement.lang,
  };
}

function postParser(el: Element | null): string {
  if (!el) {
    return '';
  }
  const body = el.querySelector('.js-post-body')?.innerHTML || '';
  const voteCount = el.querySelector('.js-vote-count')?.textContent || '';

  const footer = [...el.querySelectorAll('.post-signature')].map((el) => {
    const userName = el.querySelector('.user-details a')?.textContent || '';
    const userUrl =
      (el.querySelector('.user-details a') as HTMLAnchorElement)?.href || '';
    const userTitle = el.querySelector('.user-action-time')?.textContent || '';

    return `<h4>${userTitle}${
      userUrl ? ` by <a href="${userUrl}">${userName}</a>` : ''
    }</h4>`;
  });

  return `<h3>${voteCount} votes</h3>${body}${footer.join('')}`;
}

export default questions;
