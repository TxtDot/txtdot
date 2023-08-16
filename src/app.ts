import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";

import path from "path";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import ejs from "ejs";

import getRoute from "./routes/get";
import parseRoute from "./routes/parse";
import indexRoute from "./routes/index";
import rawHtml from "./routes/raw-html";

import publicConfig from "./publicConfig";
import errorHandler from "./errors/handler";

class App {
  config: IConfigService;

  constructor() {
    this.config = new ConfigService();
  }

  async init() {
    const fastify = Fastify({
      logger: true,
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

    fastify.register(indexRoute);
    fastify.register(getRoute);
    fastify.register(parseRoute);
    fastify.register(rawHtml);

    fastify.setErrorHandler(errorHandler);

    fastify.listen({ port: Number(this.config.get("PORT")) }, (err) => {
      err && console.log(err);
    });
  }
}

const app = new App();
app.init();
