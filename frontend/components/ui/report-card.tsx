import { LucideIcon } from "lucide-react";
import { Card } from "./card";

export function ReportCard({ title, description, icon: Icon, onClick }: { title: string; description: string; icon: LucideIcon; onClick: () => void }) {
  return <Card onClick={onClick} className="cursor-pointer p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40"><Icon className="mb-4 size-8 text-blue-600" /><h3 className="font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm text-slate-500">{description}</p></Card>;
}
