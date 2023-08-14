import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";

import Fastify from "fastify";
import fastifyView from "@fastify/view";
import ejs from "ejs";

import mainRoute from "./routes/main-route";
import parseRoute from "./routes/parseRoute";

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

    fastify.register(mainRoute);
    fastify.register(parseRoute);

    fastify.listen({ port: Number(this.config.get("PORT")) }, (err) => {
      err && console.log(err);
    });
  }
}

const app = new App();
app.init();
