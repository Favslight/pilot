"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function BulkPromotionTable({ students, onPromote }: { students: any[]; onPromote: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>(students.map((student) => student.id));
  const toggle = (id: string) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <Card className="overflow-hidden"><div className="divide-y">{students.map((student) => <label key={student.id} className="flex cursor-pointer items-center gap-3 p-4 hover:bg-blue-50"><input type="checkbox" checked={selected.includes(student.id)} onChange={() => toggle(student.id)} /><span className="font-medium">{student.firstname} {student.lastname}</span><span className="text-sm text-slate-500">{student.admission_number}</span></label>)}</div><div className="flex justify-end border-t p-4"><Button onClick={() => onPromote(selected)}>Promote Selected Students</Button></div></Card>;
}
