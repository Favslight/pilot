import { FastifyInstance } from "fastify";
import { BaseRepository } from "../repositories/base.repository";
import { armSchema, classSchema, departmentSchema, sessionSchema } from "../validators/foundation.validator";
import { assetSchema } from "../validators/staff.validator";
import { authRoutes } from "./auth.routes";
import { academicRecordRoutes } from "./academic-record.routes";
import { registerCrudRoutes } from "./crud.routes";
import { masterRoutes } from "./master.routes";
import { reportRoutes } from "./report.routes";
import { studentRoutes } from "./student.routes";
import { staffRoutes } from "./staff.routes";
import { uploadRoutes } from "./upload.routes";
import { userRoutes } from "./user.routes";

type Row = { id: string };

export const registerRoutes = async (app: FastifyInstance) => {
  await app.register(authRoutes);
  await app.register(academicRecordRoutes);
  await app.register(userRoutes);
  await app.register(masterRoutes);
  await app.register(reportRoutes);
  await app.register(studentRoutes);
  await app.register(staffRoutes);
  await app.register(uploadRoutes);
  registerCrudRoutes<Row>(app, "/api/sessions", "Academic session", new BaseRepository("academic_sessions", ["session_name", "status"], ["session_name", "is_current", "status"]), sessionSchema);
  registerCrudRoutes<Row>(app, "/api/classes", "Class", new BaseRepository("classes", ["name", "level"], ["name", "level", "display_order"]), classSchema);
  registerCrudRoutes<Row>(app, "/api/departments", "Department", new BaseRepository("departments", ["name", "description"], ["name", "description"]), departmentSchema);
  registerCrudRoutes<Row>(app, "/api/arms", "Class arm", new BaseRepository("class_arms", ["name"], ["name"]), armSchema);
  registerCrudRoutes<Row>(app, "/api/assets", "School asset", new BaseRepository("school_assets", ["asset_code", "asset_name", "category", "current_location"], ["asset_code", "asset_name", "category", "serial_number", "purchase_date", "condition", "current_location", "assigned_staff_id", "status"]), assetSchema);
};
