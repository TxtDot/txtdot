import { FastifyInstance } from "fastify";
import { engineList } from "../handlers/main";

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.get("/", async (_, reply) => {
    return reply.view("/templates/start.ejs", { engineList });
  });
}
