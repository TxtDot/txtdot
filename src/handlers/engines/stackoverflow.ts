import { Engine } from '../engine';

const SOE = new Engine('StackOverflow', [
  'stackoverflow.com',
  '*.stackoverflow.com',
  '*.stackexchange.com',
  'askubuntu.com',
  'stackapps.com',
  'mathoverflow.net',
  'superuser.com',
  'serverfault.com',
]);

SOE.route<{ id: string; slug: string }>(
  '/questions/:id/:slug',
  async (input, ro) => {
    const document = input.parseDom().window.document;

    const questionEl = document.getElementById('question');
    const question = postParser(questionEl);

    const title =
      document.querySelector('.question-hyperlink')?.innerHTML || '';

    const allAnswers = [...document.querySelectorAll('.answer')];
    const answers = allAnswers.map((a) => postParser(a));

    return {
      content: `${question}<hr>${answers.length} answers <hr>${answers.join(
        '<hr>'
      )}`,
      textContent: `${ro.q.id}/${ro.q.slug}\n`,
      title,
      lang: 'en',
    };
  }
);

function postParser(el: Element | null): string {
  if (!el) {
    return '';
  }
  const body = el.querySelector('.js-post-body')?.innerHTML || '';
  const voteCount = el.querySelector('.js-vote-count')?.textContent || '';

  return `<h3>${voteCount} votes</h3>${body}`;
}

export default SOE;
