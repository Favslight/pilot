import Fastify from "fastify";
import { errorHandler } from "./middlewares/errorHandler";
import { registerRequestLogger } from "./plugins/requestLogger";
import { registerSecurityPlugins } from "./plugins/security";
import { registerRoutes } from "./routes";

export const buildApp = async () => {
  const app = Fastify({ logger: true });
  await registerSecurityPlugins(app);
  registerRequestLogger(app);
  app.setErrorHandler(errorHandler);
  app.get("/health", async () => ({ success: true, message: "Pilot records API is healthy" }));
  await registerRoutes(app);
  return app;
};
