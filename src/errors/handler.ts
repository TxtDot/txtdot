import { FastifyReply, FastifyRequest } from "fastify";
import { NotHtmlMimetypeError } from "./main";

export default function errorHandler(
  error: Error,
  _: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof NotHtmlMimetypeError) {
    return reply.redirect(301, error.url);
  } else {
    return error;
  }
}
