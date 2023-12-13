import { FastifyInstance } from 'fastify';
import { IProxySchema, ProxySchema } from '../../types/requests/browser';
import axios from '../../types/axios';

export default async function proxyRoute(fastify: FastifyInstance) {
  fastify.get<IProxySchema>(
    '/proxy',
    { schema: ProxySchema },
    async (request, reply) => {
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
