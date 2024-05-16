import { FastifyInstance } from 'fastify';

import { distributor } from '../../plugin_manager';
import { indexSchema } from '../../types/requests/browser';

import config from '../../config';

export default async function configurationRoute(fastify: FastifyInstance) {
  fastify.get(
    '/configuration',
    { schema: indexSchema },
    async (request, reply) => {
      return reply.view('/templates/configuration.ejs', {
        engines: distributor.engines_fallback,
        middlewares: distributor.middles_fallback,
        config,
        base_url: `(${request.protocol}) - ${request.headers.host}`,
      });
    }
  );

  fastify.get(
    '/configuration/badges/big.svg',
    { schema: indexSchema },
    async (request, reply) => {
      reply.header('content-type', 'image/svg+xml');
      return reply.view('/templates/big_badge.ejs', {
        config,
        base_url: `(${request.protocol}) - ${request.headers.host}`,
      });
    }
  );
}
