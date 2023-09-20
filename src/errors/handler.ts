import { FastifyReply, FastifyRequest } from "fastify";
import { NotHtmlMimetypeError, TxtDotError } from "./main";
import { getFastifyError } from "./validation";

import { IGetSchema } from "../types/requests/browser";

export default function errorHandler(
  error: Error,
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (req.originalUrl.startsWith("/api/")) {
    return apiErrorHandler(error, reply);
  }

  const url = (req as FastifyRequest<IGetSchema>).query.url;
  return htmlErrorHandler(error, reply, url);
}

function apiErrorHandler(error: Error, reply: FastifyReply) {
  function generateResponse(code: number) {
    return reply.code(code).send({
      data: null,
      error: {
        code: code,
        name: error.name,
        message: error.message,
      },
    });
  }

  if (error instanceof NotHtmlMimetypeError) {
    return generateResponse(501);
  }

  if (getFastifyError(error)?.statusCode === 400) {
    return generateResponse(400);
  }

  if (error instanceof TxtDotError) {
    return generateResponse(error.code);
  }

  return generateResponse(500);
}

function htmlErrorHandler(error: Error, reply: FastifyReply, url: string) {
  if (error instanceof NotHtmlMimetypeError) {
    return reply.redirect(301, error.url);
  }

  if (getFastifyError(error)?.statusCode === 400) {
    return reply.code(400).view("/templates/error.ejs", {
      url,
      code: 400,
      description: `Invalid parameter specified: ${error.message}`,
    })
  }

  if (error instanceof TxtDotError) {
    return reply.code(error.code).view("/templates/error.ejs", {
      url,
      code: error.code,
      description: error.description,
    });
  }

  return reply.code(500).view("/templates/error.ejs", {
    url,
    code: 500,
    description: `${error.name}: ${error.message}`,
  });
}
