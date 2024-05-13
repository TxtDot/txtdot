import { Engine } from '@txtdot/sdk';
import { HandlerInput, Route } from '@txtdot/sdk';

const SearX = new Engine('SearX', "Engine for searching with 'SearXNG'", [
  'searx.*',
]);

async function search(
  input: HandlerInput,
  ro: Route<{ search: string; pageno?: string }>
) {
  const document = input.parseDom().window.document;
  const search = ro.q.search;
  const page = parseInt(ro.q.pageno || '1');

  const page_footer = `${
    page !== 1
      ? `<a href="${ro.reverse({ search, pageno: page - 1 })}">Previous </a>|`
      : ''
  }<a href="${ro.reverse({ search, pageno: page + 1 })}"> Next</a>`;

  const articles = Array.from(document.querySelectorAll('.result'));
  const articles_parsed = articles.map((a) => {
    const parsed = {
      url:
        (a.getElementsByClassName('url_wrapper')[0] as HTMLAnchorElement)
          .href || '',
      title:
        (a.getElementsByTagName('h3')[0] as HTMLHeadingElement).textContent ||
        '',
      content:
        (a.getElementsByClassName('content')[0] as HTMLDivElement)
          .textContent || '',
    };

    return {
      html: `<a href="${parsed.url}">${parsed.title}</a><p>${parsed.content}</p><hr>`,
      text: `${parsed.title} (${parsed.url})\n${parsed.content}\n---\n\n`,
    };
  });

  const content = `${articles_parsed
    .map((a) => a.html)
    .join('')}${page_footer}`;
  const textContent = articles_parsed.map((a) => a.text).join('');

  return {
    content,
    textContent,
    title: `${search} - Searx - Page ${page}`,
    lang: document.documentElement.lang,
  };
}

SearX.route('/search?q=:search&pageno=:pageno', search);
SearX.route('/search?q=:search', search);

export default SearX;
