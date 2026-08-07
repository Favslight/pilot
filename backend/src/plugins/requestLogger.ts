import { FastifyInstance } from "fastify";

export const registerRequestLogger = (app: FastifyInstance) => {
  app.addHook("onRequest", async (request) => {
    request.startTime = Date.now();
  });
  app.addHook("onResponse", async (request, reply) => {
    const duration = Date.now() - (request.startTime || Date.now());
    app.log.info(`${request.method} ${request.url} ${reply.statusCode} ${duration}ms`);
  });
};

declare module "fastify" {
  interface FastifyRequest {
    startTime?: number;
  }
}
