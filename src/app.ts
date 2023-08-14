import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";

import NodeCache from "node-cache";

import Fastify from "fastify";
import middie from "@fastify/middie";
import fastifyView from "@fastify/view";
import ejs from "ejs";

import mainRoute from "./routes/main-route";
import parseRoute from "./routes/parseRoute";

class App {
  config: IConfigService;
  cache: NodeCache;

  constructor() {
    this.config = new ConfigService();
    this.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  }

  async init() {
    const fastify = Fastify({
      logger: true,
    });

    await fastify.register(middie);
    await fastify.register(fastifyView, {
      engine: {
        ejs: ejs,
      }
    });

    fastify.register(mainRoute(this.cache));
    fastify.register(parseRoute(this.cache));

    fastify.listen({ port: Number(this.config.get("PORT")) }, () => {
      console.log(`Listening on port ${this.config.get("PORT")}`);
    });
  }
}

const app = new App();
app.init();
