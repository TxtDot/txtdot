import { FastifyInstance } from 'fastify';

import { IParseSchema, rawHtmlSchema } from '../../types/requests/api';

import distributor from '../../handlers/main';
import { generateRequestUrl } from '../../utils/generate';

export default async function rawHtml(fastify: FastifyInstance) {
  fastify.get<IParseSchema>(
    '/api/raw-html',
    { schema: rawHtmlSchema },
    async (request, reply) => {
      reply.type('text/html; charset=utf-8');
      return (
        await distributor.handlePage(
          request.query.url,
          generateRequestUrl(
            request.protocol,
            request.hostname,
            request.originalUrl
          ),
          request.query.engine,
          'api/raw-html'
        )
      ).content;
    }
  );
}
