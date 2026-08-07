import { Inbox } from "lucide-react";
import { Card } from "./card";

export function EmptyState({ title }: { title: string }) {
  return <Card className="grid place-items-center p-10 text-center"><Inbox className="mb-3 size-10 text-slate-300" /><p className="font-semibold text-slate-800">{title}</p><p className="mt-1 text-sm text-slate-500">No matching records found.</p></Card>;
}
