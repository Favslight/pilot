"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Building2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/forms/form-field";
import { ImageUpload } from "@/components/forms/image-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { fetchArms, fetchDepartments, fetchSchoolInformation, saveSchoolInformation } from "@/services/master.service";
import { downloadBackup } from "@/services/report.service";
import { useState } from "react";

const schema = z.object({
  school_name: z.string().min(2),
  school_code: z.string().min(2),
  motto: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  address: z.string().optional().nullable(),
  principal_name: z.string().optional().nullable(),
  vice_principal_name: z.string().optional().nullable(),
  school_logo_url: z.string().optional().nullable(),
  school_logo_public_id: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const [search, setSearch] = useState("");
  const info = useQuery({ queryKey: ["school-information"], queryFn: fetchSchoolInformation });
  const departments = useQuery({ queryKey: ["departments", search], queryFn: () => fetchDepartments(search) });
  const arms = useQuery({ queryKey: ["arms"], queryFn: () => fetchArms("") });
  const form = useForm<FormValues>({ resolver: zodResolver(schema), values: info.data || undefined });
  const save = useMutation({ mutationFn: saveSchoolInformation });
  return <div className="space-y-8"><PageHeader title="School Settings" description="Manage school identity, contact information, leadership, and branding." /><form className="grid gap-6 xl:grid-cols-[1fr_360px]" onSubmit={form.handleSubmit((values) => save.mutate(values))}><Card className="space-y-6 p-6"><section><h2 className="mb-4 flex items-center gap-2 font-semibold"><Building2 className="size-5 text-blue-600" />School Details</h2><div className="grid gap-4 md:grid-cols-2"><FormField label="School Name"><Input {...form.register("school_name")} /></FormField><FormField label="School Code"><Input {...form.register("school_code")} /></FormField><FormField label="Motto"><Input {...form.register("motto")} /></FormField><FormField label="Website"><Input {...form.register("website")} /></FormField></div></section><section><h2 className="mb-4 font-semibold">Contact Information</h2><div className="grid gap-4 md:grid-cols-2"><FormField label="Email"><Input {...form.register("email")} /></FormField><FormField label="Phone"><Input {...form.register("phone")} /></FormField><FormField label="Address"><Input {...form.register("address")} /></FormField></div></section><section><h2 className="mb-4 font-semibold">Leadership</h2><div className="grid gap-4 md:grid-cols-2"><FormField label="Principal"><Input {...form.register("principal_name")} /></FormField><FormField label="Vice Principal"><Input {...form.register("vice_principal_name")} /></FormField></div></section><Button disabled={save.isPending}><Save className="size-4" />Save Changes</Button></Card><div className="space-y-6"><Card className="h-fit p-6"><ImageUpload value={form.watch("school_logo_url") || ""} onChange={(url, publicId) => { form.setValue("school_logo_url", url); form.setValue("school_logo_public_id", publicId || ""); }} /></Card><Card className="p-6"><h2 className="font-semibold text-slate-950">Database Backup</h2><p className="mt-2 text-sm text-slate-500">Export system structure and data for demonstration backup.</p><Button type="button" className="mt-4" onClick={downloadBackup}>Download SQL Export</Button></Card></div></form><section className="space-y-4"><PageHeader title="Departments" description="Operational departments used across staff and records modules." /><TableToolbar search={search} onSearch={setSearch} /><DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Department</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y">{(departments.data?.items || []).map((department: any) => <tr key={department.id}><td className="px-4 py-4 font-medium">{department.name}</td><td className="px-4 py-4 text-slate-600">{department.description}</td><td className="px-4 py-4"><StatusBadge status={department.status} /></td></tr>)}</tbody></DataTable></section><section className="space-y-4"><PageHeader title="Class Arms" description="Arms and specialization group labels." /><div className="flex flex-wrap gap-2">{(arms.data?.items || []).map((arm: any) => <StatusBadge key={arm.id} status={arm.name} />)}</div></section></div>;
}
