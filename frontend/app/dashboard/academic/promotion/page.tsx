"use client";

import { useQuery } from "@tanstack/react-query";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { BulkPromotionTable } from "@/components/tables/bulk-promotion-table";
import { bulkPromote, fetchAcademicRecords } from "@/services/academic.service";

export default function StudentPromotionPage() {
  const [form, setForm] = useState({ source_session_id: "", source_class_id: "", source_arm_id: "", destination_session_id: "", destination_class_id: "", destination_arm_id: "", academic_status: "Active", remarks: "" });
  const records = useQuery({ queryKey: ["promotion-source"], queryFn: () => fetchAcademicRecords("") });
  const students = (records.data?.items || []).map((record: any) => ({ id: record.student_id, firstname: record.firstname, lastname: record.lastname, admission_number: record.admission_number }));
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="space-y-6"><PageHeader title="Student Promotion" description="Promote selected students manually without overwriting previous records." action={<Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><FileDown className="size-4" />Promotion Report</Button>} /><div className="grid gap-6 xl:grid-cols-[380px_1fr]"><Card className="space-y-4 p-5"><h2 className="font-semibold">Promotion Setup</h2><Input placeholder="Current Session ID" value={form.source_session_id} onChange={(event) => update("source_session_id", event.target.value)} /><Input placeholder="Current Class ID" value={form.source_class_id} onChange={(event) => update("source_class_id", event.target.value)} /><Input placeholder="Current Arm ID" value={form.source_arm_id} onChange={(event) => update("source_arm_id", event.target.value)} /><Input placeholder="Destination Session ID" value={form.destination_session_id} onChange={(event) => update("destination_session_id", event.target.value)} /><Input placeholder="Destination Class ID" value={form.destination_class_id} onChange={(event) => update("destination_class_id", event.target.value)} /><Input placeholder="Destination Arm ID" value={form.destination_arm_id} onChange={(event) => update("destination_arm_id", event.target.value)} /><Select value={form.academic_status} onChange={(event) => update("academic_status", event.target.value)}><option>Active</option><option>Repeated</option><option>Transferred</option><option>Withdrawn</option><option>Graduated</option></Select></Card><BulkPromotionTable students={students} onPromote={(ids) => bulkPromote({ ...form, student_ids: ids })} /></div></div>;
}
