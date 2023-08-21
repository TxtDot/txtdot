import { FastifyReply, FastifyRequest } from "fastify";
import { EngineParseError, IFastifyValidationError, InvalidParameterError, LocalResourceError, NotHtmlMimetypeError } from "./main";

export default function errorHandler(
  error: Error,
  _: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof NotHtmlMimetypeError) {
    return reply.redirect(301, error.url);
  } else if (error instanceof EngineParseError) {
    return reply.code(500).view("/templates/error.ejs", {
      title: "parse error",
      description: "Engine can not parse the HTML page received from the remote server.",
    });
  } else if (
    error instanceof InvalidParameterError ||
    (
      error as unknown as IFastifyValidationError
    )?.statusCode === 400
  ) {
    return reply.code(400).view("/templates/error.ejs", {
      title: "invalid parameter",
      description: `Specified parameters are invalid.`,
    });
  } else if (error instanceof LocalResourceError) {
    return reply.code(403).view("/templates/error.ejs", {
      title: "local resource",
      description: "Proxying local resources is forbidden.",
    });
  } else {
    console.log(error);
    return error;
  }
}
