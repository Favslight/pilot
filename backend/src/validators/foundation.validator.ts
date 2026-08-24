import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().optional().nullable(),
});

export const sessionSchema = z.object({
  session_name: z.string().trim().regex(/^\d{4}\/\d{4}$/),
  is_current: z.boolean().default(false),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export const departmentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const classSchema = z.object({
  name: z.string().trim().min(2).max(20),
  level: z.enum(["junior", "senior"]),
  display_order: z.number().int().positive(),
});

export const armSchema = z.object({ name: z.string().trim().min(1).max(40) });

const termBaseSchema = z.object({
  session_id: z.string().uuid(),
  term_name: z.enum(["First Term", "Second Term", "Third Term"]),
  display_order: z.number().int().min(1).max(3),
  start_date: z.string().date(),
  end_date: z.string().date(),
  status: z.enum(["active", "inactive", "closed", "archived"]).default("inactive"),
});

const termDateRangeRefinement = (value: { start_date?: string; end_date?: string }) =>
  !value.start_date || !value.end_date || value.end_date >= value.start_date;

export const termSchema = termBaseSchema.refine(termDateRangeRefinement, { message: "End date must be after start date", path: ["end_date"] });

export const updateTermSchema = termBaseSchema.partial().refine(termDateRangeRefinement, { message: "End date must be after start date", path: ["end_date"] });

export const schoolInformationSchema = z.object({
  school_name: z.string().trim().min(2).max(180),
  school_code: z.string().trim().min(2).max(40),
  motto: z.string().trim().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().trim().min(6).max(40).optional().nullable(),
  alternate_phone: z.string().trim().min(6).max(40).optional().nullable(),
  website: z.string().url().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  country: z.string().trim().min(2).default("Nigeria"),
  postal_code: z.string().trim().optional().nullable(),
  principal_name: z.string().trim().optional().nullable(),
  vice_principal_name: z.string().trim().optional().nullable(),
  school_logo_url: z.string().url().optional().nullable(),
  school_logo_public_id: z.string().trim().optional().nullable(),
});

export const assignPermissionsSchema = z.object({ permissionIds: z.array(z.string().uuid()) });
