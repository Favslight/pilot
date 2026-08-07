import { FastifyInstance } from "fastify";
import { StudentController } from "../controllers/student.controller";
import { authenticate, requirePermission, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { uuidParamSchema } from "../validators/common";
import { documentSchema, guardianSchema, medicalSchema, studentSchema } from "../validators/student.validator";

export const studentRoutes = async (app: FastifyInstance) => {
  const controller = new StudentController();
  app.get("/api/students", { preHandler: [authenticate, requirePermission("students.view")] }, controller.list);
  app.post("/api/students", { preHandler: [authenticate, requirePermission("students.create"), validate(studentSchema)] }, controller.create);
  app.get("/api/students/:id", { preHandler: [authenticate, requirePermission("students.view"), validate(uuidParamSchema, "params")] }, controller.profile);
  app.put("/api/students/:id", { preHandler: [authenticate, requirePermission("students.edit"), validate(uuidParamSchema, "params"), validate(studentSchema.partial())] }, controller.update);
  app.delete("/api/students/:id", { preHandler: [authenticate, authorize("Administrator"), validate(uuidParamSchema, "params")] }, controller.archive);

  app.get("/api/students/:studentId/guardians", { preHandler: [authenticate, requirePermission("students.view")] }, controller.guardians);
  app.post("/api/students/:studentId/guardians", { preHandler: [authenticate, requirePermission("students.edit"), validate(guardianSchema)] }, controller.createGuardian);
  app.put("/api/students/:studentId/guardians/:id", { preHandler: [authenticate, requirePermission("students.edit"), validate(guardianSchema.partial())] }, controller.updateGuardian);
  app.delete("/api/students/:studentId/guardians/:id", { preHandler: [authenticate, requirePermission("students.edit")] }, controller.deleteGuardian);
  app.get("/api/students/:studentId/medical", { preHandler: [authenticate, requirePermission("students.view")] }, controller.medical);
  app.put("/api/students/:studentId/medical", { preHandler: [authenticate, requirePermission("students.edit"), validate(medicalSchema)] }, controller.saveMedical);
  app.get("/api/students/:studentId/documents", { preHandler: [authenticate, requirePermission("students.view")] }, controller.documents);
  app.post("/api/students/:studentId/documents", { preHandler: [authenticate, requirePermission("students.documents"), validate(documentSchema)] }, controller.addDocument);
  app.delete("/api/students/:studentId/documents/:id", { preHandler: [authenticate, requirePermission("students.documents")] }, controller.deleteDocument);
};
