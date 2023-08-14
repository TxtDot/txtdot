import { FastifyRequest } from "fastify";

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
