import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import NodeCache from "node-cache";
import { readability } from "./handlers/readability";
import minify from "./handlers/main";
import Fastify from "fastify";
import middie from "@fastify/middie";
import { Cached, EngineRequest, GetRequest } from "./schema/requests.types";
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
      const purge = req.query.purge ? true : false;

      if (purge) {
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

    fastify.get("/get", async (req: GetRequest, res) => {
      const url = req.query.url;
      const type = req.query.type || "html";
      const contentType =
        type === "html"
          ? "text/html; charset=utf-8"
          : "text/plain; charset=utf-8";

      const parsed = await minify(url);
      const content = type === "html" ? parsed?.content : parsed?.textContent;

      this.cache.set(req.originalUrl || req.url, {
        content,
        contentType: contentType,
      });

      res.type(contentType);
      return content;
    });

    fastify.get("/readability", async (req: EngineRequest) => {
      const url = req.query.url;
      const parsed = await readability(url);

      this.cache.set(req.originalUrl || req.url, {
        content: parsed,
        contentType: "text/json",
      });
      return parsed;
    });

    fastify.listen({ port: Number(this.config.get("PORT")) }, () => {
      console.log(`Listening on port ${this.config.get("PORT")}`);
    });
  }
}

const app = new App();
app.init();
