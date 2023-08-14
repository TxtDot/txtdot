import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { Cached } from "./types/requests";

import NodeCache from "node-cache";

import Fastify from "fastify";
import middie from "@fastify/middie";

import getRoute from "./routes/getRoute";
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

    fastify.use((req, res, next) => {
      const url = req.originalUrl || req.url || "/";

      if (req.query.purge) {
        this.cache.del(url);
        next();
      }

      const cached: Cached | undefined = this.cache.get(url);
      if (cached) {
        res.setHeader("content-type", `${cached.contentType}; charset=utf-8`);
        res.end(cached.content);
      } else {
        next();
      }
    });

    fastify.register(getRoute(this.cache));
    fastify.register(parseRoute(this.cache));

    fastify.listen({ port: Number(this.config.get("PORT")) }, () => {
      console.log(`Listening on port ${this.config.get("PORT")}`);
    });
  }
}

const app = new App();
app.init();
