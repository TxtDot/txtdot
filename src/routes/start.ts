import { FastifyInstance } from "fastify";

export default async function parseRoute(fastify: FastifyInstance) {
  fastify.get("/start", async (_, reply) => {
    return reply.view("/templates/start.ejs");
  });
}
