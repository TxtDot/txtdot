import { FastifyRequest } from "fastify";

export type GetRequest = FastifyRequest<{
  Querystring: { url: string; type?: string };
}>;

export type EngineRequest = FastifyRequest<{
  Querystring: { url: string };
}>;

export type Cached = {
  content: string;
  contentType: string;
};
