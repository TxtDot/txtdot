import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";

import path from "path";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fastifySwagger from "@fastify/swagger";
import ejs from "ejs";

import getRoute from "./routes/get";
import parseRoute from "./routes/parse";
import indexRoute from "./routes/index";
import rawHtml from "./routes/raw-html";

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
          title: "Dottxt",
          version: "1.0.0",
        },
        externalDocs: {
          url: "https://github.com/dottxt/dottxt",
        },
      },
    });

    fastify.register(indexRoute);
    fastify.register(getRoute);
    fastify.register(parseRoute);
    fastify.register(rawHtml);

    fastify.listen({ port: Number(this.config.get("PORT")) }, (err) => {
      err && console.log(err);
    });
  }
}

const app = new App();
app.init();
