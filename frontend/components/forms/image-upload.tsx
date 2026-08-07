"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { uploadImage } from "@/services/master.service";

export function ImageUpload({ value, onChange }: { value?: string; onChange: (url: string, publicId?: string) => void }) {
  const [preview, setPreview] = useState(value || "");
  return <label className="flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 transition hover:bg-blue-50"><div className="grid size-20 place-items-center overflow-hidden rounded-lg bg-slate-100">{preview ? <img src={preview} alt="School logo preview" className="h-full w-full object-cover" /> : <ImagePlus className="size-7 text-slate-400" />}</div><div><p className="font-semibold text-slate-800">School Logo</p><p className="text-sm text-slate-500">PNG, JPG or JPEG up to 5MB.</p></div><input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const localUrl = URL.createObjectURL(file); setPreview(localUrl); const uploaded = await uploadImage(file); setPreview(uploaded.url); onChange(uploaded.url, uploaded.public_id); }} /></label>;
}
