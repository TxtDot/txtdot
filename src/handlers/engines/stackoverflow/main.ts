import { HandlerInput } from '../../handler-input';
import { IHandlerOutput } from '../../handler.interface';
import { EngineParseError } from '../../../errors/main';
import qPostsHandler from './questions-posts';

export default async function stackoverflow(
  input: HandlerInput
): Promise<IHandlerOutput> {
  const window = input.parseDom().window;

  const url = new URL(window.location.href);
  const path = url.pathname.split('/').filter((p) => p !== '');

  let result: IHandlerOutput = {
    content: '',
    textContent: '',
    title: '',
    lang: '',
  };

  if (path[0] === 'questions') {
    if (path.length === 3) {
      result = await qPostsHandler(window);
    } else if (path.length === 1) {
      result.content = 'questions';
    } else {
      throw new EngineParseError('Invalid URL [stackoverflow]');
    }
  }

  return result;
}

export const StackOverflowDomains = [
  'stackoverflow.com',
  '*.stackoverflow.com',
  '*.stackexchange.com',
  'askubuntu.com',
  'stackapps.com',
  'mathoverflow.net',
  'superuser.com',
  'serverfault.com',
];
