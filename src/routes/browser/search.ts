import { FastifyInstance } from 'fastify';

import { searchSchema, ISearchSchema } from '../../types/requests/browser';

import getConfig from '../../config/main';

export default async function searchRoute(fastify: FastifyInstance) {
  fastify.get<ISearchSchema>(
    '/search',
    { schema: searchSchema },
    async (request, reply) => {
      const query = request.query.q;

      const config = getConfig();

      if (config.search.enabled) {
        const searchUrl = `${config.search.searx_url}/search?q=${query}`;
        reply.redirect(`/get?url=${encodeURI(searchUrl)}`);
      } else {
        throw new Error('Search is not enabled');
      }
    }
  );
}
