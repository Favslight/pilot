import { FastifyReply, FastifyRequest } from "fastify";
import { ZodSchema } from "zod";
import { AppError } from "../utils/errors";

export const validate =
  (schema: ZodSchema, source: "body" | "params" | "query" = "body") =>
  async (request: FastifyRequest, _reply: FastifyReply) => {
    const result = schema.safeParse(request[source]);
    if (!result.success) throw new AppError("Validation failed", 422, result.error.flatten());
    (request as unknown as Record<string, unknown>)[source] = result.data;
  };
