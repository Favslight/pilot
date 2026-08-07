import { FastifyInstance } from "fastify";
import { AcademicRecordController } from "../controllers/academic-record.controller";
import { authenticate, authorize, requirePermission } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { uuidParamSchema } from "../validators/common";
import { academicRecordSchema, bulkPromoteSchema, promoteStudentSchema } from "../validators/academic-record.validator";

export const academicRecordRoutes = async (app: FastifyInstance) => {
  const controller = new AcademicRecordController();
  app.get("/api/academic-records", { preHandler: [authenticate, requirePermission("academic_records.view")] }, controller.list);
  app.post("/api/academic-records", { preHandler: [authenticate, requirePermission("academic_records.create"), validate(academicRecordSchema)] }, controller.create);
  app.post("/api/academic-records/bulk-promote", { preHandler: [authenticate, requirePermission("academic_records.promote"), validate(bulkPromoteSchema)] }, controller.bulkPromote);
  app.get("/api/academic-records/:id", { preHandler: [authenticate, requirePermission("academic_records.view"), validate(uuidParamSchema, "params")] }, controller.get);
  app.put("/api/academic-records/:id", { preHandler: [authenticate, requirePermission("academic_records.edit"), validate(uuidParamSchema, "params"), validate(academicRecordSchema.partial())] }, controller.update);
  app.delete("/api/academic-records/:id", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params")] }, controller.delete);
  app.get("/api/students/:id/academic-history", { preHandler: [authenticate, requirePermission("academic_records.view"), validate(uuidParamSchema, "params")] }, controller.history);
  app.post("/api/students/:id/promote", { preHandler: [authenticate, requirePermission("academic_records.promote"), validate(uuidParamSchema, "params"), validate(promoteStudentSchema)] }, controller.promote);
};
