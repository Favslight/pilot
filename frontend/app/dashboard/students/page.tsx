"use client";

import { useQuery } from "@tanstack/react-query";
import { Archive, FileDown, FileText, Plus, Printer, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatisticCard } from "@/components/ui/statistic-card";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { exportCsv } from "@/services/master.service";
import { fetchDashboardSummary } from "@/services/master.service";
import { fetchStudents } from "@/services/student.service";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const students = useQuery({ queryKey: ["students", search], queryFn: () => fetchStudents(search) });
  const summary = useQuery({ queryKey: ["dashboard-summary"], queryFn: fetchDashboardSummary });
  const rows = students.data?.items || [];
  const stats = [
    { label: "Total Students", value: String(summary.data?.totalStudents || 0), icon: FileText },
    { label: "Active", value: String(summary.data?.activeStudents || 0), icon: FileDown },
    { label: "Male", value: String(summary.data?.maleStudents || 0), icon: FileText },
    { label: "Female", value: String(summary.data?.femaleStudents || 0), icon: FileText },
  ];
  return <div className="space-y-6"><PageHeader title="Students" description="Permanent student records from admission through graduation or withdrawal." action={<Link href="/dashboard/students/register"><Button><Plus className="size-4" />Register Student</Button></Link>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatisticCard key={stat.label} {...stat} />)}</div><TableToolbar search={search} onSearch={setSearch} onExport={() => exportCsv("students.csv", rows)} />{rows.length ? <DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Passport</th><th className="px-4 py-3">Admission No.</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Gender</th><th className="px-4 py-3">Current Class</th><th className="px-4 py-3">Admission Year</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y">{rows.map((student: any) => <tr key={student.id} className="hover:bg-blue-50/40"><td className="px-4 py-4">{student.passport_url ? <img src={student.passport_url} alt="" className="size-11 rounded-lg object-cover" loading="lazy" /> : <Avatar name={`${student.firstname} ${student.lastname}`} />}</td><td className="px-4 py-4 font-semibold text-blue-700">{student.admission_number}</td><td className="px-4 py-4"><Link className="font-medium hover:text-blue-700" href={`/dashboard/students/${student.id}`}>{student.firstname} {student.lastname}</Link></td><td className="px-4 py-4">{student.gender}</td><td className="px-4 py-4">{student.current_class_name ? `${student.current_class_name} ${student.current_arm_name || ""}` : "Unassigned"}</td><td className="px-4 py-4">{student.admission_year}</td><td className="px-4 py-4"><StatusBadge status={student.current_academic_status || student.current_status} /></td><td className="px-4 py-4"><div className="flex gap-2"><Link href={`/dashboard/students/${student.id}`}><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><FileText className="size-4" /></Button></Link><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><Printer className="size-4" /></Button><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><Upload className="size-4" /></Button><Button className="size-9 bg-white px-0 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-50"><Archive className="size-4" /></Button></div></td></tr>)}</tbody></DataTable> : <EmptyState title="No students found" />}</div>;
}
