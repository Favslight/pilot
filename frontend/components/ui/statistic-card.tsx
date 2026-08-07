import { LucideIcon } from "lucide-react";
import { Card } from "./card";

export function StatisticCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return <Card className="p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{value}</p></div><div className="grid size-11 place-items-center rounded-lg bg-blue-600 text-white"><Icon className="size-5" /></div></div></Card>;
}
