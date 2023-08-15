import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";

import path from "path";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import ejs from "ejs";

import getRoute from "./routes/get";
import parseRoute from "./routes/parse";
import indexRoute from "./routes/index";

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
      root: path.join(__dirname, '..', 'static'),
      prefix: '/static/',
    });

    fastify.register(fastifyView, {
      root: path.join(__dirname, '..'),
      engine: {
        ejs: ejs,
      },
    });

    fastify.register(indexRoute);
    fastify.register(getRoute);
    fastify.register(parseRoute);

    fastify.listen({ port: Number(this.config.get("PORT")) }, (err) => {
      err && console.log(err);
    });
  }
}

const app = new App();
app.init();
