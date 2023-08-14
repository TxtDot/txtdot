import { FastifyInstance, FastifyRequest } from "fastify";
import NodeCache from "node-cache";

export type GetRequest = FastifyRequest<{
  Querystring: { url: string; type?: string };
}>;

export type EngineRequest = FastifyRequest<{
  Querystring: { url: string; engine?: string };
}>;

export type Cached = {
  content: string;
  contentType: string;
};

export interface IFastifyInstance extends FastifyInstance {
  cache: NodeCache;
}
