import { Engine } from '@txtdot/sdk';
import questions from './questions';
import users from './users';
const soEngine = new Engine(
  'StackOverflow',
  "Engine for 'StackOverflow'. Available routes: '/questions/' and '/users/'",
  [
    'stackoverflow.com',
    '*.stackoverflow.com',
    '*.stackexchange.com',
    'askubuntu.com',
    'stackapps.com',
    'mathoverflow.net',
    'superuser.com',
    'serverfault.com',
  ]
);

soEngine.route('/questions/:id/*slug', questions);
soEngine.route('/users/:id/*slug', users);

export default soEngine;
