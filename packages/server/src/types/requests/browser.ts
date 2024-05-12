import { FastifySchema } from 'fastify';
import { engineList } from '../../plugin_manager';
import { FromSchema } from 'json-schema-to-ts';

export interface IGetSchema {
  Querystring: IGetQuerySchema;
}

export interface IProxySchema {
  Querystring: IProxyQuerySchema;
}

export interface IRedirectSchema {
  Querystring: IRedirectQuerySchema;
}

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
export type IRedirectQuerySchema = {
  url: string;
  [key: string]: string;
};

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
export type IGetQuerySchema = FromSchema<typeof getQuerySchema>;

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
export type IProxyQuerySchema = FromSchema<typeof proxyQuerySchema>;

export const indexSchema = {
  hide: true,
  produces: ['text/html'],
};

export const redirectSchema: FastifySchema = {
  description: 'Universal redirection page',
  hide: true,
  querystring: redirectQuerySchema,
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
