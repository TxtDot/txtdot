import { FastifyInstance } from 'fastify';

import publicConfig from '../../publicConfig';
import { engineList } from '../../handlers/main';
import { indexSchema } from '../../types/requests/browser';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.get('/', { schema: indexSchema }, async (_, reply) => {
    return reply.view('/templates/index.ejs', { publicConfig, engineList });
  });
}
