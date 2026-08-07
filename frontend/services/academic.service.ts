import { api } from "@/lib/api";

export const fetchAcademicRecords = async (search = "") => api.get(`/academic-records?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const promoteStudent = async (studentId: string, payload: Record<string, unknown>) => api.post(`/students/${studentId}/promote`, payload).then((res) => res.data.data);
export const bulkPromote = async (payload: Record<string, unknown>) => api.post("/academic-records/bulk-promote", payload).then((res) => res.data.data);
export const fetchAcademicHistory = async (studentId: string) => api.get(`/students/${studentId}/academic-history`).then((res) => res.data.data);
