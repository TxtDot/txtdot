import NodeCache from "node-cache";
import { EngineRequest } from "../types/requests";
import { FastifyInstance } from "fastify";
import { engines } from "../handlers/main";

export default function parseRoute(cache: NodeCache) {
  return async (fastify: FastifyInstance) => {
    fastify.get("/parse", async (req: EngineRequest) => {
      const url = req.query.url;
      const engine = req.query.engine || "readability";
      const parsed = await engines[engine](url);

      cache.set(req.originalUrl || req.url, {
        content: parsed,
        contentType: "text/json",
      });
      return parsed;
    });
  };
}
