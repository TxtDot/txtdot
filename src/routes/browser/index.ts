import { FastifyInstance } from 'fastify';

import packageJSON from '../../package';
import { engineList } from '../../handlers/main';
import { indexSchema } from '../../types/requests/browser';

import env_config from '../../config/envConfig';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.get('/', { schema: indexSchema }, async (_, reply) => {
    return reply.view('/templates/index.ejs', {
      packageJSON,
      engineList,
      config: env_config,
    });
  });
}
