import { EngineRequest } from "../types/requests";
import { FastifyInstance } from "fastify";
import handlePage from "../handlers/main";

export default async function parseRoute(fastify: FastifyInstance) {
  fastify.get("/parse", async (req: EngineRequest) => {
    const parsed = await handlePage(req.query.url, req.query.engine);

    return parsed;
  });
}
