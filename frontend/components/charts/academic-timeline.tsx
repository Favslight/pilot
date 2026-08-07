import { StatusBadge } from "@/components/ui/status-badge";

export function AcademicTimeline({ records }: { records: any[] }) {
  if (!records.length) return <div className="rounded-lg border bg-slate-50 p-6 text-sm text-slate-500">No Academic Records Yet</div>;
  return <div className="relative space-y-5 border-l-2 border-blue-100 pl-6">{records.map((record) => <div key={record.id} className="relative rounded-lg border bg-white p-5 shadow-sm"><span className="absolute -left-[31px] top-6 size-3 rounded-full bg-blue-600 ring-4 ring-blue-100" /><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-medium text-blue-700">{record.session_name}</p><h3 className="mt-1 text-lg font-bold text-slate-950">{record.class_name} {record.arm_name}</h3><p className="mt-2 text-sm text-slate-500">{record.remarks || "No remarks recorded."}</p></div><StatusBadge status={record.academic_status} /></div><p className="mt-3 text-xs text-slate-400">{record.created_at ? new Date(record.created_at).toLocaleDateString() : ""}</p></div>)}</div>;
}
