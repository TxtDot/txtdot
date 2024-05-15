import { FastifyInstance } from 'fastify';

import { distributor } from '../../plugin_manager';
import { indexSchema } from '../../types/requests/browser';

import config from '../../config';

export default async function configurationRoute(fastify: FastifyInstance) {
  fastify.get('/configuration', { schema: indexSchema }, async (_, reply) => {
    return reply.view('/templates/configuration.ejs', {
      engines: distributor.engines_fallback,
      config,
    });
  });
}
