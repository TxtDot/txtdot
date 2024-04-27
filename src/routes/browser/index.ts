import { FastifyInstance } from 'fastify';

import { engineList } from '../../plugin_manager';
import { indexSchema } from '../../types/requests/browser';
import config from '../../config';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.get('/', { schema: indexSchema }, async (_, reply) => {
    return reply.view('/templates/index.ejs', {
      engineList,
      config,
    });
  });
}
