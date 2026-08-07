import { z } from "zod";

export const academicStatusSchema = z.enum(["Active", "Repeated", "Transferred", "Withdrawn", "Graduated"]);

export const academicRecordSchema = z.object({
  student_id: z.string().uuid(),
  academic_session_id: z.string().uuid(),
  class_id: z.string().uuid(),
  arm_id: z.string().uuid(),
  academic_status: academicStatusSchema.default("Active"),
  remarks: z.string().trim().optional().nullable(),
});

export const promoteStudentSchema = z.object({
  academic_session_id: z.string().uuid(),
  class_id: z.string().uuid(),
  arm_id: z.string().uuid(),
  academic_status: academicStatusSchema.default("Active"),
  remarks: z.string().trim().optional().nullable(),
});

export const bulkPromoteSchema = z.object({
  source_session_id: z.string().uuid(),
  source_class_id: z.string().uuid(),
  source_arm_id: z.string().uuid(),
  destination_session_id: z.string().uuid(),
  destination_class_id: z.string().uuid(),
  destination_arm_id: z.string().uuid(),
  student_ids: z.array(z.string().uuid()).min(1),
  academic_status: academicStatusSchema.default("Active"),
  remarks: z.string().trim().optional().nullable(),
});
