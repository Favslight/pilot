import { Badge } from "./badge";

const styles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  current: "bg-blue-50 text-blue-700",
  inactive: "bg-slate-100 text-slate-700",
  suspended: "bg-amber-50 text-amber-700",
  archived: "bg-gray-100 text-gray-700",
  closed: "bg-rose-50 text-rose-700",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={styles[status.toLowerCase()] || styles.inactive}>{status}</Badge>;
}
