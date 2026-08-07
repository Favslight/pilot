"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, FileSpreadsheet, GraduationCap, Printer, UsersRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ReportCard } from "@/components/ui/report-card";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { exportCsv } from "@/services/master.service";
import { fetchReport } from "@/services/report.service";

type Kind = "students" | "staff" | "academic";

export default function ReportsPage() {
  const [kind, setKind] = useState<Kind>("students");
  const [search, setSearch] = useState("");
  const report = useQuery({ queryKey: ["report", kind], queryFn: () => fetchReport(kind) });
  const rows = report.data || [];
  const headers = Object.keys(rows[0] || {});
  return <div className="space-y-6"><PageHeader title="Reports" description="Preview, print, export CSV, and prepare PDF-ready institutional reports." /><div className="grid gap-4 md:grid-cols-3"><ReportCard title="Student Reports" description="Student list, admission register, graduation, transfer, withdrawal, class and gender reports." icon={GraduationCap} onClick={() => setKind("students")} /><ReportCard title="Staff Reports" description="Staff directory, teaching, non-teaching, department, retired and employment lists." icon={UsersRound} onClick={() => setKind("staff")} /><ReportCard title="Academic Reports" description="Class enrollment, progression, distribution and graduation summaries." icon={BookOpen} onClick={() => setKind("academic")} /></div><Card className="p-5 print:shadow-none"><div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-bold text-slate-950">Pilot Secondary School</h2><p className="text-sm text-slate-500">{kind[0].toUpperCase() + kind.slice(1)} Report • Generated {new Date().toLocaleDateString()}</p></div><div className="flex gap-2 print:hidden"><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50" onClick={() => window.print()}><Printer className="size-4" />Print</Button><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50" onClick={() => exportCsv(`${kind}-report.csv`, rows)}><FileSpreadsheet className="size-4" />CSV</Button><Button><Download className="size-4" />PDF Ready</Button></div></div><TableToolbar search={search} onSearch={setSearch} onExport={() => exportCsv(`${kind}-report.csv`, rows)} /><div className="mt-4"><DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header.replaceAll("_", " ")}</th>)}</tr></thead><tbody className="divide-y">{rows.filter((row: any) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())).map((row: any, index: number) => <tr key={index}>{headers.map((header) => <td key={header} className="px-4 py-4 text-sm">{String(row[header] ?? "")}</td>)}</tr>)}</tbody></DataTable></div><p className="mt-6 hidden text-center text-xs text-slate-500 print:block">Pilot Secondary School Records Management System</p></Card></div>;
}
