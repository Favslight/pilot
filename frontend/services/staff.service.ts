import { api } from "@/lib/api";

export const fetchStaff = async (search = "") => api.get(`/staff?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const fetchStaffProfile = async (id: string) => api.get(`/staff/${id}`).then((res) => res.data.data);
export const createStaff = async (payload: Record<string, unknown>) => api.post("/staff", payload).then((res) => res.data.data);
export const updateStaff = async (id: string, payload: Record<string, unknown>) => api.put(`/staff/${id}`, payload).then((res) => res.data.data);
export const archiveStaff = async (id: string) => api.delete(`/staff/${id}`).then((res) => res.data.data);

export const uploadStaffPhoto = async (file: File) => {
  const body = new FormData();
  body.append("file", file);
  return api.post("/uploads/staff-photo", body, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data.data);
};
