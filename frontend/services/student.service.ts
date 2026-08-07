import { api } from "@/lib/api";

export const fetchStudents = async (search = "") => api.get(`/students?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const fetchStudent = async (id: string) => api.get(`/students/${id}`).then((res) => res.data.data);
export const createStudent = async (payload: Record<string, unknown>) => (await api.post("/students", payload)).data.data;
export const updateStudent = async (id: string, payload: Record<string, unknown>) => (await api.put(`/students/${id}`, payload)).data.data;
export const archiveStudent = async (id: string) => (await api.delete(`/students/${id}`)).data.data;
export const addGuardian = async (studentId: string, payload: Record<string, unknown>) => (await api.post(`/students/${studentId}/guardians`, payload)).data.data;
export const saveMedical = async (studentId: string, payload: Record<string, unknown>) => (await api.put(`/students/${studentId}/medical`, payload)).data.data;
export const addDocument = async (studentId: string, payload: Record<string, unknown>) => (await api.post(`/students/${studentId}/documents`, payload)).data.data;

export const uploadStudentPhoto = async (file: File) => {
  const body = new FormData();
  body.append("file", file);
  return (await api.post("/uploads/student-photo", body, { headers: { "Content-Type": "multipart/form-data" } })).data.data;
};

export const uploadStudentDocument = async (file: File) => {
  const body = new FormData();
  body.append("file", file);
  return (await api.post("/uploads/student-document", body, { headers: { "Content-Type": "multipart/form-data" } })).data.data;
};
