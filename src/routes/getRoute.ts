import NodeCache from "node-cache";
import handlePage from "../handlers/main";
import { GetRequest } from "../types/requests";
import { FastifyInstance } from "fastify";

export default function getRoute(cache: NodeCache) {
  return async (fastify: FastifyInstance) => {
    fastify.get("/get", async (req: GetRequest, res) => {
      const url = req.query.url;
      const type = req.query.type || "html";
      const contentType =
        type === "html"
          ? "text/html; charset=utf-8"
          : "text/plain; charset=utf-8";

      const parsed = await handlePage(url);
      const content = type === "html" ? parsed?.content : parsed?.textContent;

      cache.set(req.originalUrl || req.url, {
        content,
        contentType: contentType,
      });

      res.type(contentType);
      return content;
    });
  };
}
