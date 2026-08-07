import { z } from "zod";

export const createUserSchema = z.object({
  fullname: z.string().trim().min(2).max(160),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  role: z.string().uuid(),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true }).extend({
  password: z.string().min(8).optional(),
});

export const userStatusSchema = z.object({ status: z.enum(["active", "inactive", "suspended"]) });
export const resetPasswordSchema = z.object({ password: z.string().min(8) });
