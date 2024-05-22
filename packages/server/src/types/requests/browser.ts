import { FastifySchema } from 'fastify';
import { engineList } from '../../plugin_manager';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export interface Query<T> {
  Querystring: T;
}
export interface SQuery<T extends JSONSchema> {
  Querystring: FromSchema<T>;
}

// #region Query Schemas

export const redirectQuerySchema = {
  type: 'object',
  required: ['url'],
  properties: {
    url: {
      type: 'string',
      description: 'URL to redirect without querystring',
    },
  },
  patternProperties: {
    '^(?!url).*$': { type: 'string' },
  },
} as const;
export const searchQuerySchema = {
  type: 'object',
  required: ['q'],
  properties: {
    q: {
      type: 'string',
      description: 'Search query',
    },
  },
} as const;
export const getQuerySchema = {
  type: 'object',
  required: ['url'],
  properties: {
    url: {
      type: 'string',
      description: 'URL',
    },
    format: {
      type: 'string',
      enum: ['text', 'html', ''],
      default: 'html',
    },
    engine: {
      type: 'string',
      enum: [...engineList, ''],
    },
  },
} as const;
export const proxyQuerySchema = {
  type: 'object',
  required: ['url'],
  properties: {
    url: {
      type: 'string',
      description: 'URL',
    },
  },
} as const;

// #endregion

// #region Interfaces for typed requests

export type IGetSchema = SQuery<typeof getQuerySchema>;
export type IProxySchema = SQuery<typeof proxyQuerySchema>;
export type IRedirectSchema = Query<{
  url: string;
  [key: string]: string;
}>;
export type ISearchSchema = SQuery<typeof searchQuerySchema>;

// #endregion

// #region Schemas for fastify

export const indexSchema = {
  hide: true,
  produces: ['text/html'],
};
export const redirectSchema: FastifySchema = {
  description: 'Universal redirection page',
  hide: true,
  querystring: redirectQuerySchema,
};
export const searchSchema: FastifySchema = {
  description: 'Search page',
  hide: true,
  querystring: searchQuerySchema,
};
export const GetSchema: FastifySchema = {
  description: 'Get page',
  hide: true,
  querystring: getQuerySchema,
  produces: ['text/html', 'text/plain'],
};
export const ProxySchema: FastifySchema = {
  description: 'Proxy resource',
  hide: true,
  querystring: proxyQuerySchema,
};

// #endregion
