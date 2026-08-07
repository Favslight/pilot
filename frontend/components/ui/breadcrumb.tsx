export function Breadcrumb({ items }: { items: string[] }) {
  return <nav className="text-sm text-slate-500">{items.join(" / ")}</nav>;
}
