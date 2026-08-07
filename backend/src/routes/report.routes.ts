import { FastifyInstance } from "fastify";
import { ReportController } from "../controllers/report.controller";
import { authenticate, authorize, requirePermission } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { reportQuerySchema } from "../validators/report.validator";

export const reportRoutes = async (app: FastifyInstance) => {
  const controller = new ReportController();
  app.get("/api/dashboard", { preHandler: [authenticate] }, controller.dashboard);
  app.get("/api/reports/students", { preHandler: [authenticate, requirePermission("reports.view"), validate(reportQuerySchema, "query")] }, controller.students);
  app.get("/api/reports/staff", { preHandler: [authenticate, requirePermission("reports.view"), validate(reportQuerySchema, "query")] }, controller.staff);
  app.get("/api/reports/academic", { preHandler: [authenticate, requirePermission("reports.view"), validate(reportQuerySchema, "query")] }, controller.academic);
  app.get("/api/export/students", { preHandler: [authenticate, requirePermission("reports.export"), validate(reportQuerySchema, "query")] }, controller.exportCsv("students"));
  app.get("/api/export/staff", { preHandler: [authenticate, requirePermission("reports.export"), validate(reportQuerySchema, "query")] }, controller.exportCsv("staff"));
  app.get("/api/export/academic", { preHandler: [authenticate, requirePermission("reports.export"), validate(reportQuerySchema, "query")] }, controller.exportCsv("academic"));
  app.get("/api/audit-logs", { preHandler: [authenticate, authorize("Administrator")] }, controller.auditLogs);
  app.get("/api/settings", { preHandler: [authenticate] }, async (_request, reply) => reply.redirect("/api/school-information"));
  app.put("/api/settings", { preHandler: [authenticate, authorize("Administrator")] }, async (_request, reply) => reply.redirect("/api/school-information"));
  app.get("/api/backup/sql", { preHandler: [authenticate, authorize("Administrator")] }, controller.backup);
};
