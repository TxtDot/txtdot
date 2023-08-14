import NodeCache from "node-cache";
import { EngineRequest } from "../types/requests";
import { FastifyInstance } from "fastify";
import handlePage from "../handlers/main";

export default function parseRoute(cache: NodeCache) {
  return async (fastify: FastifyInstance) => {
    fastify.get("/parse", async (req: EngineRequest) => {
      const parsed = await handlePage(req.query.url, req.query.engine);

      cache.set(req.originalUrl || req.url, {
        content: parsed,
        contentType: "text/json",
      });
      return parsed;
    });
  };
}
