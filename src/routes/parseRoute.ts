import { EngineRequest } from "../types/requests";
import { FastifyInstance } from "fastify";
import handlePage from "../handlers/main";
import { generateOriginUrl } from "../utils";

export default async function parseRoute(fastify: FastifyInstance) {
  fastify.get("/parse", async (request: EngineRequest) => {
    const parsed = await handlePage(
      request.query.url,
      generateOriginUrl(
        request.protocol,
        request.hostname,
        request.originalUrl
      ),
      request.query.engine
    );

    return parsed;
  });
}
