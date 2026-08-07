import { z } from "zod";

export const studentSchema = z.object({
  admission_number: z.string().trim().max(40).optional(),
  firstname: z.string().trim().min(2).max(100),
  lastname: z.string().trim().min(2).max(100),
  middlename: z.string().trim().max(100).optional().nullable(),
  gender: z.enum(["Male", "Female"]),
  date_of_birth: z.string().date(),
  place_of_birth: z.string().trim().optional().nullable(),
  state_of_origin: z.string().trim().optional().nullable(),
  lga: z.string().trim().optional().nullable(),
  nationality: z.string().trim().min(2).default("Nigeria"),
  religion: z.string().trim().optional().nullable(),
  blood_group: z.string().trim().optional().nullable(),
  genotype: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  email: z.string().email().optional().nullable(),
  home_address: z.string().trim().optional().nullable(),
  admission_date: z.string().date(),
  admission_year: z.number().int().min(1900).max(3000),
  expected_graduation_year: z.number().int().min(1900).max(3000).optional().nullable(),
  current_status: z.enum(["Active", "Graduated", "Transferred", "Withdrawn", "Suspended", "Expelled", "Deceased", "Archived"]).default("Active"),
  passport_url: z.string().url().optional().nullable(),
  passport_public_id: z.string().trim().optional().nullable(),
  remarks: z.string().trim().optional().nullable(),
});

export const guardianSchema = z.object({
  relationship: z.enum(["Father", "Mother", "Guardian", "Sponsor"]),
  fullname: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(6).max(40),
  alternate_phone: z.string().trim().optional().nullable(),
  email: z.string().email().optional().nullable(),
  occupation: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  is_primary: z.boolean().default(false),
});

export const medicalSchema = z.object({
  blood_group: z.string().trim().optional().nullable(),
  genotype: z.string().trim().optional().nullable(),
  allergies: z.string().trim().optional().nullable(),
  medical_conditions: z.string().trim().optional().nullable(),
  physical_disability: z.string().trim().optional().nullable(),
  hospital_name: z.string().trim().optional().nullable(),
  hospital_phone: z.string().trim().optional().nullable(),
  doctor_name: z.string().trim().optional().nullable(),
  medical_notes: z.string().trim().optional().nullable(),
});

export const documentSchema = z.object({
  document_type: z.enum(["Birth Certificate", "Admission Letter", "Transfer Letter", "Passport", "Medical Report", "Other"]),
  file_name: z.string().trim().min(1).max(220),
  file_url: z.string().url(),
  public_id: z.string().trim().min(1),
  file_size: z.number().int().optional().nullable(),
  mime_type: z.string().trim().optional().nullable(),
});
