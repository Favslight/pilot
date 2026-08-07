"use client";

import { useQuery } from "@tanstack/react-query";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { exportCsv } from "@/services/master.service";
import { fetchAuditLogs } from "@/services/report.service";

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const logs = useQuery({ queryKey: ["audit-logs"], queryFn: fetchAuditLogs });
  const rows = (logs.data || []).filter((log: any) => JSON.stringify(log).toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-6"><PageHeader title="Activity Logs" description="Search, filter, and export system audit events." action={<Button onClick={() => exportCsv("audit-logs.csv", rows)}><FileSpreadsheet className="size-4" />Export</Button>} /><TableToolbar search={search} onSearch={setSearch} /><DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th><th className="px-4 py-3">IP Address</th><th className="px-4 py-3">Date</th></tr></thead><tbody className="divide-y">{rows.map((log: any) => <tr key={log.id}><td className="px-4 py-4">{log.fullname || log.email || "System"}</td><td className="px-4 py-4 font-medium">{log.action}</td><td className="px-4 py-4">{log.table_name}</td><td className="px-4 py-4">{log.ip_address || "N/A"}</td><td className="px-4 py-4">{new Date(log.created_at).toLocaleString()}</td></tr>)}</tbody></DataTable></div>;
}
