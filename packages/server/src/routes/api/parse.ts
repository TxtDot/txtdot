import { FastifyInstance } from 'fastify';

import {
  EngineRequest,
  IParseSchema,
  parseSchema,
} from '../../types/requests/api';

import { distributor } from '../../plugin_manager';
import { generateRequestUrl } from '../../utils/generate';

export default async function parseRoute(fastify: FastifyInstance) {
  fastify.get<IParseSchema>(
    '/api/parse',
    { schema: parseSchema },
    async (request: EngineRequest) => {
      return {
        data: await distributor.handlePage(
          request.query.url,
          generateRequestUrl(
            request.protocol,
            request.hostname,
            request.originalUrl
          ),
          request.query.engine
        ),
        error: null,
      };
    }
  );
}
