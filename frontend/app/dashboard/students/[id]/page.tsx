"use client";

import { useQuery } from "@tanstack/react-query";
import { Archive, Download, Edit, FileText, GraduationCap, Printer, UserRound } from "lucide-react";
import { useState } from "react";
import { AcademicTimeline } from "@/components/charts/academic-timeline";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchStudent } from "@/services/student.service";

const tabs = ["Overview", "Guardians", "Medical", "Documents", "Academic History", "Activity Log"];

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState("Overview");
  const student = useQuery({ queryKey: ["student", params.id], queryFn: () => fetchStudent(params.id) });
  if (student.isLoading) return <Skeleton className="h-96" />;
  const data = student.data;
  return <div className="space-y-6"><Card className="overflow-hidden"><div className="bg-slate-950 p-6 text-white"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="flex items-center gap-4">{data.passport_url ? <img src={data.passport_url} alt="" className="size-24 rounded-lg object-cover ring-4 ring-white/20" /> : <Avatar name={`${data.firstname} ${data.lastname}`} />}<div><h1 className="text-3xl font-bold">{data.firstname} {data.middlename} {data.lastname}</h1><p className="mt-1 text-slate-300">{data.admission_number}</p><div className="mt-3"><StatusBadge status={data.current_status} /></div></div></div><div className="flex flex-wrap gap-2"><Button className="bg-white text-slate-800 hover:bg-blue-50"><Printer className="size-4" />Print</Button><Button><Edit className="size-4" />Edit</Button><Button className="bg-amber-500 hover:bg-amber-600"><Archive className="size-4" />Archive</Button></div></div></div><div className="flex gap-2 overflow-x-auto border-b bg-white p-3">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={item === tab ? "rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50"}>{item}</button>)}</div></Card>{tab === "Overview" && <div className="grid gap-6 xl:grid-cols-3"><InfoCard title="Personal Information" rows={[["Gender", data.gender], ["Date of Birth", data.date_of_birth], ["Place of Birth", data.place_of_birth], ["State", data.state_of_origin], ["LGA", data.lga], ["Religion", data.religion]]} /><InfoCard title="Contact Information" rows={[["Phone", data.phone], ["Email", data.email], ["Address", data.home_address], ["Nationality", data.nationality]]} /><Card className="p-5"><div className="mb-4 flex items-center gap-2"><GraduationCap className="size-5 text-blue-600" /><h2 className="font-semibold">Quick Statistics</h2></div><div className="grid gap-3"><Stat label="Admission Year" value={data.admission_year} /><Stat label="Graduation Year" value={data.expected_graduation_year || "Not set"} /><Stat label="Documents" value={data.documents.length} /></div></Card></div>}{tab === "Guardians" && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.guardians.map((guardian: any) => <Card key={guardian.id} className="p-5"><div className="mb-3 flex items-center justify-between"><UserRound className="size-6 text-blue-600" />{guardian.is_primary ? <Badge>Primary Guardian</Badge> : null}</div><h3 className="font-semibold">{guardian.fullname}</h3><p className="text-sm text-slate-500">{guardian.relationship}</p><div className="mt-4 space-y-2 text-sm text-slate-600"><p>{guardian.phone}</p><p>{guardian.email}</p><p>{guardian.occupation}</p><p>{guardian.address}</p></div></Card>)}</div>}{tab === "Medical" && <Card className="p-5"><PageHeader title="Medical Summary" description="One-to-one medical record for the student." /><div className="mt-5 grid gap-3 md:grid-cols-2">{Object.entries(data.medical || {}).filter(([key]) => !["id","student_id","created_at","updated_at"].includes(key)).map(([key, value]) => <Stat key={key} label={key.replaceAll("_", " ")} value={String(value || "None")} />)}</div></Card>}{tab === "Documents" && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.documents.map((document: any) => <Card key={document.id} className="p-5"><FileText className="mb-4 size-8 text-blue-600" /><h3 className="font-semibold">{document.file_name}</h3><p className="text-sm text-slate-500">{document.document_type}</p><div className="mt-4 flex gap-2"><a href={document.file_url} target="_blank"><Button><Download className="size-4" />Download</Button></a><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50">Replace</Button></div></Card>)}</div>}{tab === "Academic History" && <AcademicTimeline records={data.academicHistory || []} />}{tab === "Activity Log" && <Card className="divide-y">{data.activity.map((log: any) => <div key={log.id} className="flex items-center justify-between p-4 text-sm"><span className="font-medium">{log.action}</span><span className="text-slate-500">{new Date(log.created_at).toLocaleString()}</span></div>)}</Card>}</div>;
}

function InfoCard({ title, rows }: { title: string; rows: [string, unknown][] }) {
  return <Card className="p-5"><h2 className="mb-4 font-semibold">{title}</h2><div className="space-y-3">{rows.map(([label, value]) => <Stat key={label} label={label} value={String(value || "Not provided")} />)}</div></Card>;
}

function Stat({ label, value }: { label: string; value: unknown }) {
  return <div className="rounded-lg border bg-slate-50 p-3"><p className="text-xs uppercase text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{String(value)}</p></div>;
}
