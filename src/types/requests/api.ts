import { FastifySchema, FastifyRequest } from "fastify";
import { IApiError, errorResponseSchema } from "../../errors/api";
import { handlerSchema } from "../../handlers/handler.interface";
import { engineList } from "../../handlers/main";

export interface IApiResponse<T> {
  data?: T;
  error?: IApiError;
}

export interface IParseQuery {
  url: string;
  engine?: string;
}

export interface IParseSchema {
  Querystring: IParseQuery;
}

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

export const parseSchema: FastifySchema = {
  description: "Parse the page and get all data from the engine",
  querystring: parseQuerySchema,
  response: {
    "2xx": {
      type: "object",
      properties: {
        data: handlerSchema,
        error: {
          type: "object",
          nullable: true,
        },
      },
    },
    "4xx": errorResponseSchema,
    "5xx": errorResponseSchema,
  },
  produces: ["text/json"],
};

export const rawHtmlSchema: FastifySchema = {
  description: "Parse the page and get raw HTML from the engine",
  querystring: parseQuerySchema,
  produces: ["text/html"],
};

export type EngineRequest = FastifyRequest<{
  Querystring: {
    url: string;
    engine?: string;
  };
}>;
