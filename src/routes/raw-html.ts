import { FastifyInstance } from "fastify";

import { GetRequest, IParseSchema, rawHtmlSchema } from "../types/requests";
import handlePage from "../handlers/main";

export default async function rawHtml(fastify: FastifyInstance) {
  fastify.get<IParseSchema>(
    "/raw-html",
    { schema: rawHtmlSchema },
    async (request: GetRequest) => {
      return (await handlePage(request.query.url)).content;
    }
  );
}
