import { Engine } from '@txtdot/sdk';

import { JSX } from '@txtdot/sdk';

const Habr = new Engine('Habr', 'Habr parser', ['*']);

Habr.route('*path', async (input, ro) => {
  return {
    content: <div>Test</div>,
  };
});

export default Habr;
