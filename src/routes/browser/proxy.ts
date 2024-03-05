import { FastifyInstance } from 'fastify';
import { IProxySchema, ProxySchema } from '../../types/requests/browser';
import axios from '../../types/axios';
import sharp from 'sharp';
import getConfig from '../../config/main';
import { UnsupportedMimetypeError } from '../../errors/main';

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

  if (getConfig().proxy.img_compress)
    fastify.get<IProxySchema>(
      '/proxy/img',
      { schema: ProxySchema },
      async (request, reply) => {
        const response = await axios.get(request.query.url, {
          responseType: 'arraybuffer',
        });

        const mime: string | undefined =
          response.headers['content-type']?.toString();

        if (!(mime && mime.startsWith('image'))) {
          throw new UnsupportedMimetypeError('image/*', mime);
        }

        const clen: number | undefined = parseInt(
          response.headers['content-length']?.toString() || '0'
        );

        if (mime.startsWith('image/svg')) {
          reply.header('Content-Type', mime);
          reply.header('Content-Length', clen);
          return reply.send(response.data);
        }

        const buffer = await sharp(response.data)
          // .grayscale(true)
          .toFormat('webp', {
            quality: 25,
            progressive: true,
            optimizeScans: true,
          })
          .toBuffer();

        reply.header('Content-Type', 'image/webp');
        reply.header('Content-Length', buffer.length);

        reply.header('x-original-size', clen);
        reply.header('x-bytes-saved', clen - buffer.length);

        return reply.send(buffer);
      }
    );
}
