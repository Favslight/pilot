import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

export const registerSecurityPlugins = async (app: FastifyInstance) => {
  await app.register(helmet);
  await app.register(compress, { global: true });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
  await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024 } });
  await app.register(jwt, { secret: env.jwtSecret });
  app.addHook("onSend", async (_request, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.header("X-Content-Type-Options", "nosniff");
  });
};
