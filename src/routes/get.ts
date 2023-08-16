import { FastifyInstance } from "fastify";

import { GetRequest } from "../types/requests";
import handlePage from "../handlers/main";
import { generateRequestUrl } from "../utils";

import { NotHtmlMimetypeError } from "../errors";

export default async function getRoute(fastify: FastifyInstance) {
  fastify.get("/get", async (request: GetRequest, reply) => {
    const remoteUrl = request.query.url;
    const engine = request.query.engine;

    let parsed;
    try {
      parsed = await handlePage(
        remoteUrl,
        generateRequestUrl(
          request.protocol,
          request.hostname,
          request.originalUrl
        ),
        engine
      );
    }
    catch (err) {
      if (err instanceof NotHtmlMimetypeError) {
        return reply.redirect(301, remoteUrl);
      }
      else {
        throw err;
      }
    }

    if (request.query.format === "text") {
      reply.type("text/plain; charset=utf-8");
      return parsed.textContent;
    } else {
      reply.type("text/html; charset=utf-8");
      return reply.view("/templates/get.ejs", { parsed: parsed });
    }
  });
}
