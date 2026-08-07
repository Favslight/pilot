"use client";

import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { PromotionModal } from "@/components/modals/promotion-modal";
import { fetchAcademicRecords } from "@/services/academic.service";
import { exportCsv } from "@/services/master.service";

export default function AcademicRecordsPage() {
  const [search, setSearch] = useState("");
  const [promoteId, setPromoteId] = useState<string | null>(null);
  const records = useQuery({ queryKey: ["academic-records", search], queryFn: () => fetchAcademicRecords(search) });
  const rows = records.data?.items || [];
  return <div className="space-y-6"><PageHeader title="Academic Records" description="One academic journey row per student per session." /><TableToolbar search={search} onSearch={setSearch} onExport={() => exportCsv("academic-records.csv", rows)} />{rows.length ? <DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Admission No.</th><th className="px-4 py-3">Session</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Arm</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y">{rows.map((record: any) => <tr key={record.id} className="hover:bg-blue-50/40"><td className="px-4 py-4"><div className="flex items-center gap-3">{record.passport_url ? <img src={record.passport_url} alt="" className="size-10 rounded-lg object-cover" loading="lazy" /> : <Avatar name={`${record.firstname} ${record.lastname}`} />}<span className="font-medium">{record.firstname} {record.lastname}</span></div></td><td className="px-4 py-4 font-semibold text-blue-700">{record.admission_number}</td><td className="px-4 py-4">{record.session_name}</td><td className="px-4 py-4">{record.class_name}</td><td className="px-4 py-4">{record.arm_name}</td><td className="px-4 py-4"><StatusBadge status={record.academic_status} /></td><td className="px-4 py-4 text-slate-500">{new Date(record.created_at).toLocaleDateString()}</td><td className="px-4 py-4"><div className="flex gap-2"><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><Eye className="size-4" /></Button><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><Pencil className="size-4" /></Button><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50" onClick={() => setPromoteId(record.student_id)}><TrendingUp className="size-4" /></Button><Button className="size-9 bg-white px-0 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"><Trash2 className="size-4" /></Button></div></td></tr>)}</tbody></DataTable> : <EmptyState title="No academic records found" />}<PromotionModal open={Boolean(promoteId)} studentId={promoteId || ""} onClose={() => setPromoteId(null)} /></div>;
}
