import { FastifyReply, FastifyRequest } from "fastify";
import { NotHtmlMimetypeError, TxtDotError } from "./main";
import { getFastifyError } from "./validation";

export default function errorHandler(
  error: Error,
  _: FastifyRequest,
  reply: FastifyReply
) {
  // TODO: check if req.url starts with "/api/" and return JSON

  return htmlErrorHandler(error, reply);
}

function htmlErrorHandler(error: Error, reply: FastifyReply) {
  if (error instanceof NotHtmlMimetypeError) {
    return reply.redirect(301, error.url);
  }

  if (getFastifyError(error)?.statusCode === 400) {
    return reply.code(400).view("/templates/error.ejs", {
      code: 400,
      description: `Invalid parameter specified: ${error.message}`,
    })
  }

  if (error instanceof TxtDotError) {
    return reply.code(error.code).view("/templates/error.ejs", {
      code: error.code,
      description: error.description,
    });
  }

  return reply.code(500).view("/templates/error.ejs", {
    code: 500,
    description: `${error.name}: ${error.message}`,
  });
}
