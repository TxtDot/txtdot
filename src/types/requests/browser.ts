import { FastifyRequest, FastifySchema } from "fastify";
import { engineList } from "../../handlers/main";

export type GetRequest = FastifyRequest<{
  Querystring: IGetQuery;
}>;

export interface IGetQuery {
  url: string;
  format?: string;
  engine?: string;
}

export interface IGetSchema {
  Querystring: IGetQuery;
}

export const indexSchema = {
  produces: ["text/html"],
  hide: true
};

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
      enum: [...engineList, ""],
    },
  },
};

export const GetSchema: FastifySchema = {
  description: "Get page",
  hide: true,
  querystring: getQuerySchema,
  produces: ["text/html", "text/plain"],
};
