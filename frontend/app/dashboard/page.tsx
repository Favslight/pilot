"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, BriefcaseBusiness, GraduationCap, Repeat, Trophy, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatisticCard } from "@/components/ui/statistic-card";
import { DataTable } from "@/components/tables/data-table";
import { fetchDashboardSummary } from "@/services/master.service";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { fetchAnalytics } from "@/services/report.service";

export default function DashboardPage() {
  const summary = useQuery({ queryKey: ["dashboard-summary"], queryFn: fetchDashboardSummary });
  const analytics = useQuery({ queryKey: ["dashboard-analytics"], queryFn: fetchAnalytics });
  const data = summary.data || {};
  const stats = [
    { label: "Total Students", value: String(data.totalStudents || 0), icon: GraduationCap },
    { label: "Active Students", value: String(data.activeStudents || 0), icon: UsersRound },
    { label: "Total Staff", value: String(data.totalStaff || 0), icon: BriefcaseBusiness },
    { label: "Graduated", value: String(data.graduatedStudents || 0), icon: Trophy },
  ];
  return <div className="space-y-6"><PageHeader title="Dashboard" description="Institutional records overview for Pilot Secondary School." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatisticCard key={stat.label} {...stat} />)}</div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{(data.classStats || []).map((item: any) => <Card key={item.class_name} className="p-4"><p className="text-sm text-slate-500">Students in {item.class_name}</p><p className="mt-2 text-2xl font-bold text-slate-950">{item.count}</p></Card>)}</div><div className="grid gap-4 lg:grid-cols-2"><SimpleBarChart title="Students by Gender" data={analytics.data?.studentsByGender || []} labelKey="gender" valueKey="count" /><SimpleBarChart title="Staff by Employment Type" data={analytics.data?.staffByEmploymentType || []} labelKey="employment_type" valueKey="count" /><SimpleBarChart title="Students by Admission Year" data={analytics.data?.studentsByAdmissionYear || []} labelKey="admission_year" valueKey="count" /><SimpleBarChart title="Graduation Trend" data={analytics.data?.graduationTrend || []} labelKey="session_name" valueKey="count" /></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><Card className="p-4"><p className="text-sm text-slate-500">Teaching Staff</p><p className="mt-2 text-2xl font-bold text-slate-950">{data.teachingStaff || 0}</p></Card><Card className="p-4"><p className="text-sm text-slate-500">Non-Teaching Staff</p><p className="mt-2 text-2xl font-bold text-slate-950">{data.nonTeachingStaff || 0}</p></Card><Card className="p-4"><p className="text-sm text-slate-500">Staff On Leave</p><p className="mt-2 text-2xl font-bold text-slate-950">{data.onLeaveStaff || 0}</p></Card></div><div className="grid gap-6 xl:grid-cols-[1fr_360px]"><DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Activity</th><th className="px-4 py-3">Entity</th><th className="px-4 py-3">When</th></tr></thead><tbody className="divide-y">{(data.latestActivities || []).map((log: any) => <tr key={log.id}><td className="px-4 py-4">{log.action}</td><td className="px-4 py-4">{log.table_name}</td><td className="px-4 py-4"><Badge>{new Date(log.created_at).toLocaleString()}</Badge></td></tr>)}</tbody></DataTable><Card className="p-5"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-lg bg-blue-600 text-white"><Activity className="size-5" /></div><div><h2 className="font-semibold text-slate-950">Notifications</h2><p className="text-sm text-slate-500">{data.currentSession?.session_name || "No current session"}</p></div></div><div className="mt-6 space-y-3 text-sm text-slate-600">{["New Student Added", "Staff Updated", "Current Session Changed", "Promotion Completed"].map((item) => <div key={item} className="rounded-lg border bg-gray-50 p-3">{item}</div>)}</div></Card></div></div>;
}
