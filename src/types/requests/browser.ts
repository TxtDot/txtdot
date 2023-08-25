import { FastifySchema } from "fastify";
import { engineList } from "../../handlers/main";
import { FromSchema } from "json-schema-to-ts";

export interface IGetSchema {
  Querystring: IGetQuerySchema;
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
} as const;
export type IGetQuerySchema = FromSchema<typeof getQuerySchema>;

export const GetSchema: FastifySchema = {
  description: "Get page",
  hide: true,
  querystring: getQuerySchema,
  produces: ["text/html", "text/plain"],
};
