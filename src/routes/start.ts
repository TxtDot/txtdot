import { FastifyInstance } from "fastify";
import { engineList } from "../handlers/main";

export default async function parseRoute(fastify: FastifyInstance) {
  fastify.get("/start", async (_, reply) => {
    return reply.view("/templates/start.ejs", { engineList });
  });
}
