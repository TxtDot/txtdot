import { FastifyInstance } from "fastify";

import { GetRequest } from "../types/requests";
import handlePage from "../handlers/main";

export default async function mainRoute(fastify: FastifyInstance) {
  fastify.get("/", async (request: GetRequest, reply) => {
    const remoteUrl = request.query.url;
    const engine = request.query.engine || "readability";

    let format: string;

    if (request.query.format === "text") {
      reply.type("text/plain; charset=utf-8");
      format = "text";
    } else {
      reply.type("text/html; charset=utf-8");
      format = "html";
    }

    const parsed = await handlePage(remoteUrl, engine);

    if (format === "text") {
      return parsed.textContent;
    } else {
      return reply.view("/templates/index.ejs", { parsed: parsed });
    }
  });
}
