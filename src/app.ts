import path from "path";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import ejs from "ejs";

import indexRoute from "./routes/browser/index";
import getRoute from "./routes/browser/get";
import proxyRoute from "./routes/browser/proxy";
import parseRoute from "./routes/api/parse";
import rawHtml from "./routes/api/raw-html";

import publicConfig from "./publicConfig";
import errorHandler from "./errors/handler";
import getConfig from "./config/main";

class App {
  async init() {
    const config = getConfig();

    const fastify = Fastify({
      logger: true,
      trustProxy: config.reverse_proxy,
      connectionTimeout: config.timeout
    });

    fastify.register(fastifyStatic, {
      root: path.join(process.cwd(), "static"),
      prefix: "/static/",
    });

    fastify.register(fastifyView, {
      engine: {
        ejs: ejs,
      },
    });

    if (config.swagger) {
      await fastify.register(fastifySwagger, {
        swagger: {
          info: {
            title: "TXTDot API",
            description: publicConfig.description,
            version: publicConfig.version,
          },
        },
      });
      await fastify.register(fastifySwaggerUi, { routePrefix: "/doc" });
    }

    fastify.register(indexRoute);
    fastify.register(getRoute);

    if (config.proxy_res) fastify.register(proxyRoute);

    fastify.register(parseRoute);
    fastify.register(rawHtml);

    fastify.setErrorHandler(errorHandler);

    fastify.listen({ host: config.host, port: config.port }, (err) => {
      err && console.log(err);
    });
  }
}

const app = new App();
app.init();
