"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createStaff, uploadStaffPhoto } from "@/services/staff.service";

const schema = z.object({
  staff_number: z.string().optional(),
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  middlename: z.string().optional(),
  gender: z.enum(["Male", "Female"]),
  date_of_birth: z.string().optional(),
  phone: z.string().optional(),
  alternate_phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  state_of_origin: z.string().optional(),
  lga: z.string().optional(),
  nationality: z.string().default("Nigeria"),
  religion: z.string().optional(),
  employment_date: z.string().min(1),
  department_id: z.string().min(1),
  designation: z.string().min(2),
  employment_type: z.enum(["Teaching", "Non-Teaching", "Contract", "Temporary"]),
  status: z.enum(["Active", "On Leave", "Retired", "Resigned", "Suspended", "Terminated"]).default("Active"),
  qualification: z.string().optional(),
  remarks: z.string().optional(),
  passport_url: z.string().optional(),
  passport_public_id: z.string().optional(),
});

const steps = ["Personal", "Employment", "Passport", "Review"];

export function StaffWizard() {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const form = useForm<any>({ resolver: zodResolver(schema), defaultValues: { gender: "Male", nationality: "Nigeria", employment_type: "Teaching", status: "Active", employment_date: new Date().toISOString().slice(0, 10) } });
  const submit = async (values: any) => {
    const staff = await createStaff(values);
    setMessage(`Staff registered: ${staff.staff_number}`);
  };
  return <Card className="p-6"><div className="mb-6 flex flex-wrap gap-2">{steps.map((label, index) => <span key={label} className={index === step ? "rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white" : "rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"}>{index + 1}. {label}</span>)}</div><form onSubmit={form.handleSubmit(submit)} className="space-y-5">{step === 0 && <div className="grid gap-4 md:grid-cols-2"><Input placeholder="Staff Number auto-generated" {...form.register("staff_number")} /><Input placeholder="First Name" {...form.register("firstname")} /><Input placeholder="Middle Name" {...form.register("middlename")} /><Input placeholder="Last Name" {...form.register("lastname")} /><Select {...form.register("gender")}><option>Male</option><option>Female</option></Select><Input type="date" {...form.register("date_of_birth")} /><Input placeholder="Phone" {...form.register("phone")} /><Input placeholder="Alternate Phone" {...form.register("alternate_phone")} /><Input placeholder="Email" {...form.register("email")} /><Input placeholder="State of Origin" {...form.register("state_of_origin")} /><Input placeholder="LGA" {...form.register("lga")} /><Input placeholder="Religion" {...form.register("religion")} /><Textarea placeholder="Address" {...form.register("address")} /></div>}{step === 1 && <div className="grid gap-4 md:grid-cols-2"><Input type="date" {...form.register("employment_date")} /><Input placeholder="Department ID" {...form.register("department_id")} /><Input placeholder="Designation" {...form.register("designation")} /><Select {...form.register("employment_type")}><option>Teaching</option><option>Non-Teaching</option><option>Contract</option><option>Temporary</option></Select><Select {...form.register("status")}><option>Active</option><option>On Leave</option><option>Retired</option><option>Resigned</option><option>Suspended</option><option>Terminated</option></Select><Input placeholder="Highest Qualification" {...form.register("qualification")} /><Textarea placeholder="Remarks" {...form.register("remarks")} /></div>}{step === 2 && <label className="grid min-h-52 cursor-pointer place-items-center rounded-lg border border-dashed bg-slate-50 text-center transition hover:bg-blue-50"><div><Upload className="mx-auto mb-3 size-8 text-blue-600" /><p className="font-semibold">Upload Staff Passport</p><p className="text-sm text-slate-500">PNG, JPG or JPEG up to 5MB.</p></div><input className="hidden" type="file" accept="image/png,image/jpeg,image/jpg" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const uploaded = await uploadStaffPhoto(file); form.setValue("passport_url", uploaded.url); form.setValue("passport_public_id", uploaded.public_id); }} /></label>}{step === 3 && <div className="grid gap-4 md:grid-cols-2"><Review title="Name" value={`${form.watch("firstname") || ""} ${form.watch("lastname") || ""}`} /><Review title="Designation" value={form.watch("designation") || ""} /><Review title="Employment Type" value={form.watch("employment_type")} /><Review title="Status" value={form.watch("status")} /></div>}{message ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}<div className="flex justify-between border-t pt-5"><Button type="button" className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50" onClick={() => setStep(Math.max(0, step - 1))}><ChevronLeft className="size-4" />Previous</Button>{step < steps.length - 1 ? <Button type="button" onClick={() => setStep(step + 1)}>Next<ChevronRight className="size-4" /></Button> : <Button type="submit"><Check className="size-4" />Submit</Button>}</div></form></Card>;
}

function Review({ title, value }: { title: string; value: string }) {
  return <div className="rounded-lg border bg-slate-50 p-4"><p className="text-sm text-slate-500">{title}</p><p className="mt-1 font-semibold text-slate-900">{value || "Not provided"}</p></div>;
}
