import { FastifyInstance } from "fastify";
import { engineList } from "../handlers/main";
import { indexSchema } from "../types/requests";

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.get("/", { schema: indexSchema }, async (_, reply) => {
    return reply.view("/templates/index.ejs", { engineList });
  });
}
