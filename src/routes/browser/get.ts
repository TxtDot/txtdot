import { FastifyInstance } from "fastify";

import { GetSchema, IGetSchema } from "../../types/requests/browser";
import handlePage from "../../handlers/main";
import { generateRequestUrl } from "../../utils/generate";

export default async function getRoute(fastify: FastifyInstance) {
  fastify.get<IGetSchema>(
    "/get",
    { schema: GetSchema },
    async (request, reply) => {
      const remoteUrl = request.query.url;
      const engine = request.query.engine;

      const parsed = await handlePage(
        remoteUrl,
        generateRequestUrl(
          request.protocol,
          request.hostname,
          request.originalUrl
        ),
        engine
      );

      if (request.query.format === "text") {
        reply.type("text/plain; charset=utf-8");
        return parsed.textContent;
      } else {
        reply.type("text/html; charset=utf-8");
        return reply.view("/templates/get.ejs", { parsed, remoteUrl });
      }
    }
  );
}
