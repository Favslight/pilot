import { FastifyReply } from "fastify";

export const sendSuccess = <T>(reply: FastifyReply, message: string, data?: T, status = 200) =>
  reply.status(status).send({ success: true, message, data });
