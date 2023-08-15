import { FastifyInstance } from "fastify";
import { engineList } from "../handlers/main";

const desc = (
  "txtdot is a HTTP proxy that parses text, links and pictures " +
  "from pages reducing internet traffic, removing ads and heavy scripts"
);

export default async function parseRoute(fastify: FastifyInstance) {
  fastify.get("/start", async (_, reply) => {
    return reply.view("/templates/start.ejs", { desc, engineList });
  });
}
