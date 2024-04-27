import { FastifyInstance } from 'fastify';

import packageJSON from '../../package';
import distributor from '../../handlers/main';
import { indexSchema } from '../../types/requests/browser';

import env_config from '../../config/envConfig';
import dynConfig from '../../config/dynConfig';

export default async function configurationRoute(fastify: FastifyInstance) {
  fastify.get('/configuration', { schema: indexSchema }, async (_, reply) => {
    return reply.view('/templates/configuration.ejs', {
      packageJSON,
      engines: distributor.fallback,
      dynConfig,
      config: env_config,
    });
  });
}
