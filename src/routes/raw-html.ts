import { FastifyInstance } from "fastify";

import { GetRequest, IParseSchema, rawHtmlSchema } from "../types/requests";
import handlePage from "../handlers/main";
import { generateRequestUrl } from "../utils/generate";

export default async function rawHtml(fastify: FastifyInstance) {
  fastify.get<IParseSchema>(
    "/api/raw-html",
    { schema: rawHtmlSchema },
    async (request: GetRequest) => {
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
