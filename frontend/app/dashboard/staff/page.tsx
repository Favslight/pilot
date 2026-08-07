"use client";

import { useQuery } from "@tanstack/react-query";
import { Archive, FileText, Plus, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatisticCard } from "@/components/ui/statistic-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { exportCsv, fetchDashboardSummary } from "@/services/master.service";
import { fetchStaff } from "@/services/staff.service";
import { UsersRound, GraduationCap, BriefcaseBusiness, Clock } from "lucide-react";

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const staff = useQuery({ queryKey: ["staff", search], queryFn: () => fetchStaff(search) });
  const summary = useQuery({ queryKey: ["dashboard-summary"], queryFn: fetchDashboardSummary });
  const rows = staff.data?.items || [];
  const stats = [
    { label: "Total Staff", value: String(summary.data?.totalStaff || 0), icon: UsersRound },
    { label: "Teaching Staff", value: String(summary.data?.teachingStaff || 0), icon: GraduationCap },
    { label: "Non-Teaching", value: String(summary.data?.nonTeachingStaff || 0), icon: BriefcaseBusiness },
    { label: "On Leave", value: String(summary.data?.onLeaveStaff || 0), icon: Clock },
  ];
  return <div className="space-y-6"><PageHeader title="Staff" description="Permanent employee records for teaching and non-teaching staff." action={<Link href="/dashboard/staff/register"><Button><Plus className="size-4" />Register Staff</Button></Link>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatisticCard key={stat.label} {...stat} />)}</div><TableToolbar search={search} onSearch={setSearch} onExport={() => exportCsv("staff.csv", rows)} />{rows.length ? <DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Passport</th><th className="px-4 py-3">Staff No.</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y">{rows.map((member: any) => <tr key={member.id} className="hover:bg-blue-50/40"><td className="px-4 py-4">{member.passport_url ? <img src={member.passport_url} alt="" className="size-11 rounded-lg object-cover" loading="lazy" /> : <Avatar name={`${member.firstname} ${member.lastname}`} />}</td><td className="px-4 py-4 font-semibold text-blue-700">{member.staff_number}</td><td className="px-4 py-4"><Link className="font-medium hover:text-blue-700" href={`/dashboard/staff/${member.id}`}>{member.firstname} {member.lastname}</Link></td><td className="px-4 py-4">{member.department_name}</td><td className="px-4 py-4">{member.designation}</td><td className="px-4 py-4">{member.employment_type}</td><td className="px-4 py-4"><StatusBadge status={member.status} /></td><td className="px-4 py-4"><div className="flex gap-2"><Link href={`/dashboard/staff/${member.id}`}><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><FileText className="size-4" /></Button></Link><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><Printer className="size-4" /></Button><Button className="size-9 bg-white px-0 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-50"><Archive className="size-4" /></Button></div></td></tr>)}</tbody></DataTable> : <EmptyState title="No staff found" />}</div>;
}
