import { FastifyInstance } from "fastify";

import { GetSchema, IGetSchema } from "../types/requests";
import handlePage from "../handlers/main";
import { generateRequestUrl } from "../utils";

export default async function getRoute(fastify: FastifyInstance) {
  fastify.get<IGetSchema>(
    "/get",
    { schema: GetSchema },
    async (request, reply) => {
      const remoteUrl = request.query.url;
      const engine = request.query.engine;

      let format: string;

      if (request.query.format === "text") {
        reply.type("text/plain; charset=utf-8");
        format = "text";
      } else {
        reply.type("text/html; charset=utf-8");
        format = "html";
      }

      const parsed = await handlePage(
        remoteUrl,
        generateRequestUrl(
          request.protocol,
          request.hostname,
          request.originalUrl
        ),
        engine
      );

      if (format === "text") {
        return parsed.textContent;
      } else {
        return reply.view("/templates/get.ejs", { parsed: parsed });
      }
    }
  );
}