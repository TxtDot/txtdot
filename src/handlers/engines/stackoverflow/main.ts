import { Engine } from '../../engine';
import questions from './questions';
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

SOE.route('/questions/:id/:slug', questions);

export default SOE;
