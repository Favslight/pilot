import { FastifyInstance } from "fastify";
import { MasterController } from "../controllers/master.controller";
import { CrudController } from "../controllers/crud.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { BaseRepository } from "../repositories/base.repository";
import { BaseService } from "../services/base.service";
import { uuidParamSchema, paginationSchema } from "../validators/common";
import { assignPermissionsSchema, roleSchema, schoolInformationSchema, termSchema } from "../validators/foundation.validator";
import { registerCrudRoutes } from "./crud.routes";

type Row = { id: string };

export const masterRoutes = async (app: FastifyInstance) => {
  const controller = new MasterController();
  const roleCrud = new CrudController(new BaseService(new BaseRepository<Row>("roles", ["name", "description"], ["name", "description"]), "Role"), "Role");
  app.get("/api/permissions", { preHandler: [authenticate, authorize("Administrator")] }, controller.permissions);
  app.get("/api/roles", { preHandler: [authenticate, authorize("Administrator")] }, controller.roles);
  app.post("/api/roles", { preHandler: [authenticate, authorize("Administrator"), validate(roleSchema)] }, roleCrud.create);
  app.put("/api/roles/:id", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params"), validate(roleSchema.partial())] }, roleCrud.update);
  app.delete("/api/roles/:id", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params"), controller.deleteRoleGuard] }, roleCrud.delete);
  app.get("/api/roles/:id/permissions", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params")] }, controller.rolePermissions);
  app.put("/api/roles/:id/permissions", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params"), validate(assignPermissionsSchema)] }, controller.assignPermissions);
  app.post("/api/roles/:id/duplicate", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params")] }, controller.duplicateRole);
  app.patch("/api/sessions/:id/current", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params")] }, controller.setCurrentSession);
  registerCrudRoutes<Row>(app, "/api/terms", "Term", new BaseRepository("terms", ["term_name", "status"], ["session_id", "term_name", "display_order", "start_date", "end_date", "status"]), termSchema);
  app.patch("/api/terms/:id/active", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params")] }, controller.setActiveTerm);

  app.get("/api/school-information", { preHandler: [authenticate] }, controller.schoolInfo);
  app.put("/api/school-information", { preHandler: [authenticate, authorize("Administrator"), validate(schoolInformationSchema)] }, controller.updateSchoolInfo);
  app.get("/api/dashboard/summary", { preHandler: [authenticate] }, controller.dashboard);
  app.get("/api/search", { preHandler: [authenticate] }, controller.search);
};
