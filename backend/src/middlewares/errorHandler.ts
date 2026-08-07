import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

export const errorHandler = (error: FastifyError | AppError | ZodError, _request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ success: false, message: error.message, errors: error.errors });
  }
  if (error instanceof ZodError) {
    return reply.status(422).send({ success: false, message: "Validation failed", errors: error.flatten() });
  }
  const statusCode = "statusCode" in error && error.statusCode ? error.statusCode : 500;
  return reply.status(statusCode).send({ success: false, message: statusCode === 500 ? "Internal server error" : error.message });
};
