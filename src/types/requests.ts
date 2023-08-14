import { FastifyInstance, FastifyRequest } from "fastify";
import NodeCache from "node-cache";

export type GetRequest = FastifyRequest<{
  Querystring: {
    url: string;
    format?: string;
    engine?: string;
  };
}>;

export type EngineRequest = FastifyRequest<{
  Querystring: {
    url: string;
    engine?: string;
  };
}>;

export interface IFastifyInstance extends FastifyInstance {
  cache: NodeCache;
}
