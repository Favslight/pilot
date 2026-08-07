"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Permission = { id: string; name: string; module: string; description?: string };

export function PermissionMatrix({ permissions, selected, onSave }: { permissions: Permission[]; selected: string[]; onSave: (ids: string[]) => void }) {
  const [checked, setChecked] = useState(selected);
  const grouped = useMemo(() => permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    acc[permission.module] = [...(acc[permission.module] || []), permission];
    return acc;
  }, {}), [permissions]);
  const toggle = (id: string) => setChecked((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <Card className="divide-y overflow-hidden">{Object.entries(grouped).map(([module, items]) => <details key={module} open className="group"><summary className="cursor-pointer bg-slate-50 px-5 py-4 font-semibold text-slate-900">{module}</summary><div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((permission) => <label key={permission.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm transition hover:bg-blue-50"><input type="checkbox" checked={checked.includes(permission.id)} onChange={() => toggle(permission.id)} className="mt-1 size-4 rounded border-gray-300 text-blue-600" /><span><span className="block font-medium text-slate-800">{permission.name.split(".").pop()}</span><span className="text-slate-500">{permission.description}</span></span></label>)}</div></details>)}<div className="flex justify-end bg-white p-4"><Button onClick={() => onSave(checked)}>Save Permissions</Button></div></Card>;
}
