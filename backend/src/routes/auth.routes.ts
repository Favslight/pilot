import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { changePasswordSchema, loginSchema, refreshSchema } from "../validators/auth.validator";

export const authRoutes = async (app: FastifyInstance) => {
  const controller = new AuthController(app);
  app.post("/api/auth/login", { preHandler: [validate(loginSchema)] }, controller.login);
  app.post("/api/auth/logout", { preHandler: [authenticate] }, controller.logout);
  app.post("/api/auth/refresh", { preHandler: [validate(refreshSchema)] }, controller.refresh);
  app.get("/api/auth/me", { preHandler: [authenticate] }, controller.me);
  app.get("/api/auth/profile", { preHandler: [authenticate] }, controller.profile);
  app.put("/api/auth/change-password", { preHandler: [authenticate, validate(changePasswordSchema)] }, controller.changePassword);
};
