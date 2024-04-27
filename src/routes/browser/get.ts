import { FastifyInstance } from 'fastify';

import { GetSchema, IGetSchema } from '../../types/requests/browser';
import distributor from '../../handlers/main';
import { generateRequestUrl } from '../../utils/generate';

import env_config from '../../config/envConfig';

export default async function getRoute(fastify: FastifyInstance) {
  fastify.get<IGetSchema>(
    '/get',
    { schema: GetSchema },
    async (request, reply) => {
      const remoteUrl = request.query.url;
      const engine = request.query.engine;

      const parsed = await distributor.handlePage(
        remoteUrl,
        generateRequestUrl(
          request.protocol,
          request.hostname,
          request.originalUrl
        ),
        engine
      );

      if (request.query.format === 'text') {
        reply.type('text/plain; charset=utf-8');
        return parsed.textContent;
      } else {
        reply.type('text/html; charset=utf-8');
        return reply.view('/templates/get.ejs', {
          parsed,
          remoteUrl,
          config: env_config,
        });
      }
    }
  );
}
