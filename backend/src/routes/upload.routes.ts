import { FastifyInstance } from "fastify";
import { authenticate, authorize } from "../middlewares/auth";
import { uploadImage, uploadStudentDocument } from "../utils/upload";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/errors";

export const uploadRoutes = async (app: FastifyInstance) => {
  app.post("/api/uploads/image", { preHandler: [authenticate, authorize("Administrator")] }, async (request, reply) => {
    const file = await request.file();
    if (!file) throw new AppError("Image file is required", 422);
    return sendSuccess(reply, "Image uploaded", await uploadImage(file), 201);
  });
  app.post("/api/uploads/student-photo", { preHandler: [authenticate] }, async (request, reply) => {
    const file = await request.file();
    if (!file) throw new AppError("Student photo is required", 422);
    return sendSuccess(reply, "Student photo uploaded", await uploadImage(file), 201);
  });
  app.post("/api/uploads/staff-photo", { preHandler: [authenticate] }, async (request, reply) => {
    const file = await request.file();
    if (!file) throw new AppError("Staff photo is required", 422);
    return sendSuccess(reply, "Staff photo uploaded", await uploadImage(file), 201);
  });
  app.post("/api/uploads/student-document", { preHandler: [authenticate] }, async (request, reply) => {
    const file = await request.file();
    if (!file) throw new AppError("Student document is required", 422);
    return sendSuccess(reply, "Student document uploaded", await uploadStudentDocument(file), 201);
  });
};
