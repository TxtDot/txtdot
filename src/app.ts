import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";

import Fastify from "fastify";
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

    await fastify.register(fastifyView, {
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
