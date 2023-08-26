import { FastifyInstance } from "fastify";

import { IParseSchema, rawHtmlSchema } from "../../types/requests/api";

import handlePage from "../../handlers/main";
import { generateRequestUrl } from "../../utils/generate";

export default async function rawHtml(fastify: FastifyInstance) {
  fastify.get<IParseSchema>(
    "/api/raw-html",
    { schema: rawHtmlSchema },
    async (request) => {
      return (
        await handlePage(
          request.query.url,
          generateRequestUrl(
            request.protocol,
            request.hostname,
            request.originalUrl
          )
        )
      ).content;
    }
  );
}
