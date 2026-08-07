import { FastifyInstance } from "fastify";
import { StaffController } from "../controllers/staff.controller";
import { authenticate, requirePermission } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { uuidParamSchema } from "../validators/common";
import { staffSchema } from "../validators/staff.validator";

export const staffRoutes = async (app: FastifyInstance) => {
  const controller = new StaffController();
  app.get("/api/staff", { preHandler: [authenticate, requirePermission("staff.view")] }, controller.list);
  app.post("/api/staff", { preHandler: [authenticate, requirePermission("staff.create"), validate(staffSchema)] }, controller.create);
  app.get("/api/staff/:id", { preHandler: [authenticate, requirePermission("staff.view"), validate(uuidParamSchema, "params")] }, controller.get);
  app.put("/api/staff/:id", { preHandler: [authenticate, requirePermission("staff.edit"), validate(uuidParamSchema, "params"), validate(staffSchema.partial())] }, controller.update);
  app.delete("/api/staff/:id", { preHandler: [authenticate, requirePermission("staff.delete"), validate(uuidParamSchema, "params")] }, controller.archive);
};
