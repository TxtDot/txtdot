import { Engine, JSX } from '@txtdot/sdk';
import { HandlerInput, Route } from '@txtdot/sdk';
import { PageFooter, ResultItem } from '../components/searchers';

const SearX = new Engine('SearX', "Engine for searching with 'SearXNG'", [
  'searx.*',
]);

async function search(
  input: HandlerInput,
  ro: Route<{ search: string; pageno?: string }>
) {
  const document = input.document;
  const search = ro.q.search;
  const page = parseInt(ro.q.pageno || '1');

  let previous: string | null;
  let next: string | null;

  if (ro.q.pageno) {
    previous = ro.reverse({ search, pageno: page - 1 }) || null;
    next = ro.reverse({ search, pageno: page + 1 }) || null;
  } else {
    previous = null;
    next = `/search?q=${search}&pageno=${page + 1}`;
  }

  const articles = Array.from(document.querySelectorAll('.result'));

  const articles_parsed = articles.map((a) => {
    const parsed = {
      url:
        (a.getElementsByClassName('url_header')[0] as HTMLAnchorElement).href ||
        '',
      title:
        (a.getElementsByTagName('h3')[0] as HTMLHeadingElement).textContent ||
        '',
      content:
        (a.getElementsByClassName('content')[0] as HTMLDivElement)
          .textContent || '',
    };

    return <ResultItem {...parsed} />;
  });

  const content = (
    <>
      {articles_parsed}
      <PageFooter page={page} previous={previous} next={next} />
    </>
  );
  return {
    content: content,
    title: `"${(document.getElementById('q') as HTMLInputElement).value}" - Searx - Page ${page}`,
  };
}

SearX.route('/search?q=:search&pageno=:pageno', search);
SearX.route('/search?q=:search', search);

export default SearX;
