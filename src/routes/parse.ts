import { EngineRequest, IParseSchema, parseSchema } from "../types/requests";
import { FastifyInstance } from "fastify";
import handlePage from "../handlers/main";

export default async function parseRoute(fastify: FastifyInstance) {
  fastify.get<IParseSchema>(
    "/parse",
    { schema: parseSchema },
    async (request: EngineRequest) => {
      return await handlePage(request.query.url, request.query.engine);
    }
  );
}
