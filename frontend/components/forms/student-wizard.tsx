"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addGuardian, saveMedical, createStudent, uploadStudentDocument, uploadStudentPhoto } from "@/services/student.service";

const schema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  middlename: z.string().optional(),
  admission_number: z.string().optional(),
  gender: z.enum(["Male", "Female"]),
  date_of_birth: z.string().min(1),
  place_of_birth: z.string().optional(),
  state_of_origin: z.string().optional(),
  lga: z.string().optional(),
  nationality: z.string().default("Nigeria"),
  religion: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  home_address: z.string().optional(),
  admission_date: z.string().min(1),
  admission_year: z.coerce.number(),
  expected_graduation_year: z.coerce.number().optional(),
  current_status: z.string().default("Active"),
  passport_url: z.string().optional(),
  passport_public_id: z.string().optional(),
  blood_group: z.string().optional(),
  genotype: z.string().optional(),
  allergies: z.string().optional(),
  medical_conditions: z.string().optional(),
  physical_disability: z.string().optional(),
  medical_notes: z.string().optional(),
  guardians: z.array(z.object({ relationship: z.string(), fullname: z.string(), phone: z.string(), email: z.string().optional(), occupation: z.string().optional(), address: z.string().optional(), is_primary: z.boolean() })).default([]),
  documents: z.array(z.any()).default([]),
});

type Values = z.infer<typeof schema>;
const steps = ["Personal", "Contact", "Guardians", "Medical", "Documents", "Passport", "Review"];

export function StudentWizard() {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const form = useForm<any>({ resolver: zodResolver(schema), defaultValues: { gender: "Male", nationality: "Nigeria", current_status: "Active", admission_date: new Date().toISOString().slice(0, 10), admission_year: new Date().getFullYear(), guardians: [{ relationship: "Father", fullname: "", phone: "", is_primary: true }], documents: [] } });
  const guardians = useFieldArray({ control: form.control, name: "guardians" });
  useEffect(() => {
    const saved = localStorage.getItem("studentRegistrationDraft");
    if (saved) form.reset(JSON.parse(saved));
    const subscription = form.watch((value) => localStorage.setItem("studentRegistrationDraft", JSON.stringify(value)));
    return () => subscription.unsubscribe();
  }, [form]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  const submit = async (values: Values) => {
    const student = await createStudent(values);
    for (const guardian of values.guardians) await addGuardian(student.id, guardian);
    await saveMedical(student.id, {
      blood_group: values.blood_group,
      genotype: values.genotype,
      allergies: values.allergies,
      medical_conditions: values.medical_conditions,
      physical_disability: values.physical_disability,
      medical_notes: values.medical_notes,
    });
    localStorage.removeItem("studentRegistrationDraft");
    setMessage(`Student registered: ${student.admission_number}`);
  };
  return <Card className="p-6"><div className="mb-6 flex flex-wrap gap-2">{steps.map((label, index) => <span key={label} className={index === step ? "rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white" : "rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"}>{index + 1}. {label}</span>)}</div><form onSubmit={form.handleSubmit(submit)} className="space-y-5">{step === 0 && <div className="grid gap-4 md:grid-cols-2"><Input placeholder="Admission Number auto-generated" {...form.register("admission_number")} /><Input placeholder="First Name" {...form.register("firstname")} /><Input placeholder="Middle Name" {...form.register("middlename")} /><Input placeholder="Last Name" {...form.register("lastname")} /><Select {...form.register("gender")}><option>Male</option><option>Female</option></Select><Input type="date" {...form.register("date_of_birth")} /><Input placeholder="Place of Birth" {...form.register("place_of_birth")} /><Input placeholder="State" {...form.register("state_of_origin")} /><Input placeholder="LGA" {...form.register("lga")} /><Input placeholder="Religion" {...form.register("religion")} /></div>}{step === 1 && <div className="grid gap-4 md:grid-cols-2"><Input placeholder="Phone" {...form.register("phone")} /><Input placeholder="Email" {...form.register("email")} /><Input type="date" {...form.register("admission_date")} /><Input placeholder="Admission Year" type="number" {...form.register("admission_year")} /><Input placeholder="Expected Graduation Year" type="number" {...form.register("expected_graduation_year")} /><Textarea placeholder="Home Address" {...form.register("home_address")} /></div>}{step === 2 && <div className="space-y-4">{guardians.fields.map((field, index) => <div key={field.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-3"><Select {...form.register(`guardians.${index}.relationship`)}><option>Father</option><option>Mother</option><option>Guardian</option><option>Sponsor</option></Select><Input placeholder="Full Name" {...form.register(`guardians.${index}.fullname`)} /><Input placeholder="Phone" {...form.register(`guardians.${index}.phone`)} /><Input placeholder="Email" {...form.register(`guardians.${index}.email`)} /><Input placeholder="Occupation" {...form.register(`guardians.${index}.occupation`)} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register(`guardians.${index}.is_primary`)} />Primary</label></div>)}<Button type="button" onClick={() => guardians.append({ relationship: "Guardian", fullname: "", phone: "", is_primary: false })}>Add Guardian</Button></div>}{step === 3 && <div className="grid gap-4 md:grid-cols-2"><Input placeholder="Blood Group" {...form.register("blood_group")} /><Input placeholder="Genotype" {...form.register("genotype")} /><Textarea placeholder="Allergies" {...form.register("allergies")} /><Textarea placeholder="Medical Conditions" {...form.register("medical_conditions")} /><Textarea placeholder="Disabilities" {...form.register("physical_disability")} /><Textarea placeholder="Medical Notes" {...form.register("medical_notes")} /></div>}{step === 4 && <DropUpload label="Upload Documents" onUpload={uploadStudentDocument} />}{step === 5 && <DropUpload label="Upload Passport" onUpload={async (file) => { const uploaded = await uploadStudentPhoto(file); form.setValue("passport_url", uploaded.url); form.setValue("passport_public_id", uploaded.public_id); return uploaded; }} />}{step === 6 && <div className="grid gap-4 md:grid-cols-2"><Review title="Student" value={`${form.watch("firstname")} ${form.watch("lastname")}`} /><Review title="Admission Year" value={String(form.watch("admission_year"))} /><Review title="Guardians" value={`${form.watch("guardians").length} guardian(s)`} /><Review title="Status" value={form.watch("current_status")} /></div>}{message ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}<div className="flex justify-between border-t pt-5"><Button type="button" className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50" onClick={() => setStep(Math.max(0, step - 1))}><ChevronLeft className="size-4" />Previous</Button><div className="flex gap-2"><Button type="button" className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50" onClick={() => localStorage.setItem("studentRegistrationDraft", JSON.stringify(form.getValues()))}><Save className="size-4" />Save Draft</Button>{step < steps.length - 1 ? <Button type="button" onClick={() => setStep(step + 1)}>Next<ChevronRight className="size-4" /></Button> : <Button type="submit"><Check className="size-4" />Submit</Button>}</div></div></form></Card>;
}

function DropUpload({ label, onUpload }: { label: string; onUpload: (file: File) => Promise<any> }) {
  const [name, setName] = useState("");
  return <label className="grid min-h-52 cursor-pointer place-items-center rounded-lg border border-dashed bg-slate-50 text-center transition hover:bg-blue-50"><div><Upload className="mx-auto mb-3 size-8 text-blue-600" /><p className="font-semibold">{label}</p><p className="text-sm text-slate-500">{name || "PDF, PNG, JPG or JPEG. Preview and progress ready."}</p></div><input className="hidden" type="file" accept=".pdf,image/png,image/jpeg,image/jpg" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setName(file.name); await onUpload(file); }} /></label>;
}

function Review({ title, value }: { title: string; value: string }) {
  return <div className="rounded-lg border bg-slate-50 p-4"><p className="text-sm text-slate-500">{title}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>;
}
