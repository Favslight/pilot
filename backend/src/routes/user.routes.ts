import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import { MasterController } from "../controllers/master.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { paginationSchema, uuidParamSchema } from "../validators/common";
import { createUserSchema, resetPasswordSchema, updateUserSchema, userStatusSchema } from "../validators/user.validator";

export const userRoutes = async (app: FastifyInstance) => {
  const controller = new UserController();
  const master = new MasterController();
  app.get("/api/users", { preHandler: [authenticate, authorize("Administrator"), validate(paginationSchema, "query")] }, controller.list);
  app.post("/api/users", { preHandler: [authenticate, authorize("Administrator"), validate(createUserSchema)] }, controller.create);
  app.put("/api/users/:id", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params"), validate(updateUserSchema)] }, controller.update);
  app.delete("/api/users/:id", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params")] }, controller.delete);
  app.patch("/api/users/:id/status", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params"), validate(userStatusSchema)] }, master.userStatus);
  app.patch("/api/users/:id/reset-password", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params"), validate(resetPasswordSchema)] }, master.resetPassword);
};
