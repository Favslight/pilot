import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
});

export const refreshSchema = z.object({ refreshToken: z.string().min(20) });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});
