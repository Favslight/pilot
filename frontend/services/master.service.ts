import { api } from "@/lib/api";

export const fetchDashboardSummary = async () => api.get("/dashboard/summary").then((res) => res.data.data);
export const fetchUsers = async (search = "") => api.get(`/users?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const fetchRoles = async () => api.get("/roles").then((res) => res.data.data);
export const fetchPermissions = async () => api.get("/permissions").then((res) => res.data.data);
export const assignPermissions = async (roleId: string, permissionIds: string[]) => (await api.put(`/roles/${roleId}/permissions`, { permissionIds })).data;
export const fetchSessions = async (search = "") => api.get(`/sessions?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const fetchTerms = async (search = "") => api.get(`/terms?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const fetchDepartments = async (search = "") => api.get(`/departments?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const fetchClasses = async (search = "") => api.get(`/classes?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const fetchArms = async (search = "") => api.get(`/arms?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const fetchSchoolInformation = async () => api.get("/school-information").then((res) => res.data.data);
export const fetchAssets = async (search = "") => api.get(`/assets?search=${encodeURIComponent(search)}`).then((res) => res.data.data);
export const saveSchoolInformation = async (payload: Record<string, unknown>) => (await api.put("/school-information", payload)).data.data;
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return (await api.post("/uploads/image", formData, { headers: { "Content-Type": "multipart/form-data" } })).data.data;
};

export const exportCsv = (filename: string, rows: Record<string, unknown>[]) => {
  const headers = Object.keys(rows[0] || { empty: "" });
  const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
