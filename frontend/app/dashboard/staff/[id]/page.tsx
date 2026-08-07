"use client";

import { useQuery } from "@tanstack/react-query";
import { Archive, BriefcaseBusiness, Edit, Printer } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchStaffProfile } from "@/services/staff.service";

const tabs = ["Overview", "Employment", "Activity Log"];

export default function StaffProfilePage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState("Overview");
  const staff = useQuery({ queryKey: ["staff-profile", params.id], queryFn: () => fetchStaffProfile(params.id) });
  if (staff.isLoading) return <Skeleton className="h-96" />;
  const data = staff.data;
  return <div className="space-y-6"><Card className="overflow-hidden"><div className="bg-slate-950 p-6 text-white"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="flex items-center gap-4">{data.passport_url ? <img src={data.passport_url} alt="" className="size-24 rounded-lg object-cover ring-4 ring-white/20" /> : <Avatar name={`${data.firstname} ${data.lastname}`} />}<div><h1 className="text-3xl font-bold">{data.firstname} {data.middlename} {data.lastname}</h1><p className="mt-1 text-slate-300">{data.staff_number} • {data.designation}</p><p className="text-slate-300">{data.department_name}</p><div className="mt-3"><StatusBadge status={data.status} /></div></div></div><div className="flex flex-wrap gap-2"><Button className="bg-white text-slate-800 hover:bg-blue-50"><Printer className="size-4" />Print</Button><Button><Edit className="size-4" />Edit</Button><Button className="bg-amber-500 hover:bg-amber-600"><Archive className="size-4" />Archive</Button></div></div></div><div className="flex gap-2 overflow-x-auto border-b bg-white p-3">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={item === tab ? "rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50"}>{item}</button>)}</div></Card>{tab === "Overview" && <div className="grid gap-6 xl:grid-cols-3"><InfoCard title="Personal Information" rows={[["Gender", data.gender], ["Date of Birth", data.date_of_birth], ["State", data.state_of_origin], ["LGA", data.lga], ["Nationality", data.nationality], ["Religion", data.religion]]} /><InfoCard title="Contact Information" rows={[["Phone", data.phone], ["Alternate Phone", data.alternate_phone], ["Email", data.email], ["Address", data.address]]} /><InfoCard title="Qualification" rows={[["Highest Qualification", data.qualification], ["Remarks", data.remarks]]} /></div>}{tab === "Employment" && <Card className="p-5"><PageHeader title="Employment" description="Current staff employment information." /><div className="mt-5 grid gap-3 md:grid-cols-2"><Stat label="Employment Date" value={data.employment_date} /><Stat label="Department" value={data.department_name} /><Stat label="Designation" value={data.designation} /><Stat label="Employment Type" value={data.employment_type} /><Stat label="Current Status" value={data.status} /></div></Card>}{tab === "Activity Log" && <Card className="divide-y">{(data.activity || []).map((log: any) => <div key={log.id} className="flex items-center justify-between p-4 text-sm"><span className="font-medium">{log.action}</span><span className="text-slate-500">{new Date(log.created_at).toLocaleString()}</span></div>)}</Card>}</div>;
}

function InfoCard({ title, rows }: { title: string; rows: [string, unknown][] }) {
  return <Card className="p-5"><h2 className="mb-4 font-semibold">{title}</h2><div className="space-y-3">{rows.map(([label, value]) => <Stat key={label} label={label} value={String(value || "Not provided")} />)}</div></Card>;
}

function Stat({ label, value }: { label: string; value: unknown }) {
  return <div className="rounded-lg border bg-slate-50 p-3"><p className="text-xs uppercase text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{String(value || "Not provided")}</p></div>;
}
