import { z } from "zod";

export const reportQuerySchema = z.object({
  search: z.string().trim().optional(),
  academic_session_id: z.string().uuid().optional(),
  class_id: z.string().uuid().optional(),
  department_id: z.string().uuid().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  status: z.string().trim().optional(),
  admission_year: z.coerce.number().int().optional(),
  employment_year: z.coerce.number().int().optional(),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
}).refine((value) => !value.date_from || !value.date_to || value.date_to >= value.date_from, {
  message: "End date must be after start date",
  path: ["date_to"],
});

export const searchQuerySchema = z.object({ q: z.string().trim().min(1).max(120) });
