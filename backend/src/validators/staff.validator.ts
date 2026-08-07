import { z } from "zod";

export const staffSchema = z.object({
  staff_number: z.string().trim().max(30).optional(),
  firstname: z.string().trim().min(2).max(100),
  lastname: z.string().trim().min(2).max(100),
  middlename: z.string().trim().optional().nullable(),
  gender: z.enum(["Male", "Female"]),
  date_of_birth: z.string().date().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  alternate_phone: z.string().trim().optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  state_of_origin: z.string().trim().optional().nullable(),
  lga: z.string().trim().optional().nullable(),
  nationality: z.string().trim().min(2).default("Nigeria"),
  religion: z.string().trim().optional().nullable(),
  qualification: z.string().trim().optional().nullable(),
  employment_date: z.string().date(),
  department_id: z.string().uuid(),
  designation: z.string().trim().min(2).max(120),
  employment_type: z.enum(["Teaching", "Non-Teaching", "Contract", "Temporary"]),
  status: z.enum(["Active", "On Leave", "Retired", "Resigned", "Suspended", "Terminated", "Archived"]).default("Active"),
  passport_url: z.string().url().optional().nullable(),
  passport_public_id: z.string().trim().optional().nullable(),
  remarks: z.string().trim().optional().nullable(),
});

export const assetSchema = z.object({
  asset_code: z.string().trim().min(2).max(40),
  asset_name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(120),
  serial_number: z.string().trim().optional().nullable(),
  purchase_date: z.string().date().optional().nullable(),
  condition: z.enum(["New", "Good", "Fair", "Damaged"]).default("Good"),
  current_location: z.string().trim().optional().nullable(),
  assigned_staff_id: z.string().uuid().optional().nullable(),
  status: z.enum(["Available", "Assigned", "Under Maintenance", "Retired"]).default("Available"),
});
