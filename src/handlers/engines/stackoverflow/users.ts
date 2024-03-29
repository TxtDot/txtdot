import { Route } from '../../../types/handlers';
import { HandlerInput } from '../../handler-input';

async function users(
  input: HandlerInput,
  ro: Route<{ id: string; slug: string }>
) {
  const document = input.parseDom().window.document;

  const userInfo =
    document.querySelector('.md\\:ai-start > div:nth-child(2)')?.textContent ||
    '';

  const topPosts = [
    ...(document.querySelector('#js-top-posts > div:nth-child(2)')?.children ||
      []),
  ]
    .map((el) => {
      const title = el.querySelector('a')?.textContent || '';
      const url = el.querySelector('a')?.href || '';
      const votes = el.querySelector('.s-badge__votes')?.textContent || '';
      const type =
        el.querySelector('.iconAnswer, .iconQuestion')?.textContent || '';

      return `<strong>${type} (${votes}) </strong><a href="${url}">${title}</a>`;
    })
    .join('<br/>');

  return {
    content: `${userInfo}<hr><h3>Top Posts</h3>${topPosts}`,
    textContent: `${ro.q.id}/${ro.q.slug}\n`, // TODO
    title: document.querySelector('title')?.textContent || '',
    lang: document.documentElement.lang,
  };
}

export default users;
