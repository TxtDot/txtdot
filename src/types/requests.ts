import { FastifyRequest, FastifySchema } from "fastify";

export type GetRequest = FastifyRequest<{
  Querystring: {
    url: string;
    format?: string;
    engine?: string;
  };
}>;

export interface IGetQuery {
  url: string;
  format?: string;
  engine?: string;
}

export interface IGetSchema {
  Querystring: IGetQuery;
}

export const getQuerySchema = {
  type: "object",
  required: ["url"],
  properties: {
    url: {
      type: "string",
      description: "URL",
    },
    format: {
      type: "string",
      enum: ["text", "html", ""],
      default: "html",
    },
    engine: {
      type: "string",
      enum: ["readability", "google", ""],
      default: "readability",
    },
  },
};

export const GetSchema: FastifySchema = {
  description: "Get page",
  querystring: getQuerySchema,
  produces: ["text/html"],
};

export type EngineRequest = FastifyRequest<{
  Querystring: {
    url: string;
    engine?: string;
  };
}>;
