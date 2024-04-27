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

import packageJSON from './package';
import errorHandler from './errors/handler';
import redirectRoute from './routes/browser/redirect';

import dynConfig from './config/dynConfig';
import configurationRoute from './routes/browser/configuration';
import env_config from './config/envConfig';

class App {
  async init() {
    const fastify = Fastify({
      logger: true,
      trustProxy: env_config.reverse_proxy,
      connectionTimeout: env_config.timeout,
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

    if (env_config.swagger) {
      dynConfig.addRoute('/doc');
      await fastify.register(fastifySwagger, {
        swagger: {
          info: {
            title: 'TXTDot API',
            description: packageJSON.description,
            version: packageJSON.version,
          },
        },
      });
      await fastify.register(fastifySwaggerUi, { routePrefix: '/doc' });
    }

    fastify.addHook('onRoute', (route) => {
      dynConfig.addRoute(route.url);
    });

    fastify.register(indexRoute);
    fastify.register(getRoute);
    fastify.register(configurationRoute);

    env_config.third_party.searx_url && fastify.register(redirectRoute);
    env_config.proxy.enabled && fastify.register(proxyRoute);

    fastify.register(parseRoute);
    fastify.register(rawHtml);

    fastify.listen({ host: env_config.host, port: env_config.port }, (err) => {
      err && console.log(err);
    });
  }
}

const app = new App();
app.init();
