import { ReactNode } from "react";

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700"><span className="mb-2 block">{label}</span>{children}</label>;
}
