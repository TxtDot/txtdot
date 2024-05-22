import { FastifyInstance } from 'fastify';

import {
  redirectSchema,
  IRedirectSchema,
  ISearchSchema,
  searchSchema,
} from '../../types/requests/browser';

import config from '../../config';

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

  if (config.env.third_party.searx_url) {
    fastify.get<ISearchSchema>(
      '/search',
      { schema: searchSchema },
      async (request, reply) => {
        reply.redirect(
          `/get?url=${encodeURIComponent(
            config.env.third_party.searx_url +
              '/search?q=' +
              encodeURIComponent(request.query.q)
          )}`
        );
      }
    );
  }
}
