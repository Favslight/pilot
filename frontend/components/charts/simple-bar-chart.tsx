import { Card } from "@/components/ui/card";

export function SimpleBarChart({ title, data, labelKey, valueKey }: { title: string; data: any[]; labelKey: string; valueKey: string }) {
  const max = Math.max(1, ...data.map((item) => Number(item[valueKey] || 0)));
  return <Card className="p-5"><h3 className="mb-4 font-semibold text-slate-950">{title}</h3><div className="space-y-3">{data.map((item) => <div key={String(item[labelKey])}><div className="mb-1 flex justify-between text-sm"><span className="text-slate-600">{String(item[labelKey])}</span><span className="font-semibold">{Number(item[valueKey] || 0)}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${(Number(item[valueKey] || 0) / max) * 100}%` }} /></div></div>)}</div></Card>;
}
