import { FastifyRequest, FastifySchema } from "fastify";
import { handlerSchema } from "../handlers/handler.interface";
import { engineList } from "../handlers/main";

export type GetRequest = FastifyRequest<{
  Querystring: IGetQuery;
}>;

export interface IGetQuery {
  url: string;
  format?: string;
  engine?: string;
}

export interface IParseQuery {
  url: string;
  engine?: string;
}

export interface IGetSchema {
  Querystring: IGetQuery;
}

export interface IParseSchema {
  Querystring: IParseQuery;
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

export const parseQuerySchema = {
  type: "object",
  required: ["url"],
  properties: {
    url: {
      type: "string",
      description: "URL",
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

export const parseSchema: FastifySchema = {
  description: "Parse page",
  querystring: parseQuerySchema,
  response: {
    "2xx": handlerSchema,
  },
  produces: ["text/json"],
};

export const rawHtmlSchema: FastifySchema = {
  description: "Get raw HTML",
  querystring: parseQuerySchema,
  produces: ["text/html"],
};

export type EngineRequest = FastifyRequest<{
  Querystring: {
    url: string;
    engine?: string;
  };
}>;
