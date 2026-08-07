import { api } from "@/lib/api";

export type LoginPayload = { email: string; password: string };

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};
