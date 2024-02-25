import { FastifyInstance } from 'fastify';

import { redirectSchema, IRedirectSchema } from '../../types/requests/browser';

export default async function redirectRoute(fastify: FastifyInstance) {
  fastify.get<IRedirectSchema>(
    '/redirect',
    { schema: redirectSchema },
    async (request, reply) => {
      const params = new URLSearchParams(request.query);
      params.delete('url');

      reply.redirect(
        `/get?url=${encodeURIComponent(
          request.query.url + '?' + params.toString()
        )}`
      );
    }
  );
}
