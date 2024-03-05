import { FastifyInstance } from 'fastify';
import { IProxySchema, ProxySchema } from '../../types/requests/browser';
import axios from '../../types/axios';

import isLocalResource from '../../utils/islocal';
import { LocalResourceError } from '../../errors/main';

export default async function proxyRoute(fastify: FastifyInstance) {
  fastify.get<IProxySchema>(
    '/proxy',
    { schema: ProxySchema },
    async (request, reply) => {
      if (await isLocalResource(new URL(request.query.url))) {
        throw new LocalResourceError();
      }

      const response = await axios.get(request.query.url);
      const mime: string | undefined =
        response.headers['content-type']?.toString();
      const clen: string | undefined =
        response.headers['content-length']?.toString();
      mime && reply.header('Content-Type', mime);
      clen && reply.header('Content-Length', Number(clen));
      return reply.send(response.data);
    }
  );
}
