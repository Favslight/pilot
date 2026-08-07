import { api } from "@/lib/api";

export const fetchAnalytics = async () => api.get("/dashboard").then((res) => res.data.data);

export const fetchReport = async (kind: "students" | "staff" | "academic") => api.get(`/reports/${kind}`).then((res) => res.data.data);

export const globalSearch = async (q: string) => {
  if (!q.trim()) return [];
  return api.get(`/search?search=${encodeURIComponent(q)}`).then((res) => res.data.data);
};

export const fetchAuditLogs = async () => api.get("/audit-logs").then((res) => res.data.data);

export const downloadBackup = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/backup/sql`;
};
