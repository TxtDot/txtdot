import { FastifyInstance } from "fastify";
import NodeCache from "node-cache";

import { GetRequest } from "../types/requests";
import { IHandlerOutput } from "../handlers/handler.interface";
import handlePage from "../handlers/main";

export default function mainRoute(cache: NodeCache) {
  return async (fastify: FastifyInstance) => {
    fastify.get("/", async (req: GetRequest, res) => {
      const remoteUrl = req.query.url;
      const engine = req.query.engine || "readability";

      let format: string;

      if (req.query.format === "text") {
        res.type("text/plain; charset=utf-8");
        format = "text";
      }
      else {
        res.type("text/html; charset=utf-8");
        format = "html";
      }

      const cacheKey = req.originalUrl || req.url;
      const cached: string | undefined = cache.get(cacheKey);

      if (cached) {
        res.send(cached);
        return;
      }

      const parsed = await handlePage(remoteUrl, engine);

      if (format === "text") {
        const content = parsed.textContent;
        cache.set(cacheKey, content);
        res.send(content);
      }
      else {
        const content = parsed.content;
        cache.set(cacheKey, content);
        res.view("/template/index.ejs", { parsed: parsed });
      }
    });
  };
}
