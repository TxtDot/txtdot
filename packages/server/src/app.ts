import path from 'path';

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import ejs from 'ejs';

import indexRoute from './routes/browser/index';
import getRoute from './routes/browser/get';
import proxyRoute from './routes/browser/proxy';
import parseRoute from './routes/api/parse';
import rawHtml from './routes/api/raw-html';

import errorHandler from './errors/handler';
import redirectRoute from './routes/browser/redirect';

import configurationRoute from './routes/browser/configuration';

import config from './config';

class App {
  async init() {
    const fastify = Fastify({
      logger: true,
      trustProxy: config.env.reverse_proxy,
      connectionTimeout: config.env.timeout,
    });

    fastify.setErrorHandler(errorHandler);

    fastify.register(fastifyStatic, {
      root: path.join(process.cwd(), 'static'),
      prefix: '/static/',
    });

    fastify.register(fastifyView, {
      engine: {
        ejs: ejs,
      },
    });

    if (config.env.swagger) {
      config.dyn.addRoute('/doc');
      await fastify.register(fastifySwagger, {
        swagger: {
          info: {
            title: 'TXTDot API',
            description: config.package.description,
            version: config.package.version,
          },
        },
      });
      await fastify.register(fastifySwaggerUi, { routePrefix: '/doc' });
    }

    fastify.addHook('onRoute', (route) => {
      config.dyn.addRoute(route.url);
    });

    fastify.register(indexRoute);
    fastify.register(getRoute);
    fastify.register(configurationRoute);

    config.env.third_party.searx_url && fastify.register(redirectRoute);
    config.env.proxy.enabled && fastify.register(proxyRoute);

    fastify.register(parseRoute);
    fastify.register(rawHtml);

    fastify.listen({ host: config.env.host, port: config.env.port }, (err) => {
      err && console.log(err);
    });
  }
}

const app = new App();
app.init();
