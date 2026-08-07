export function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <div className="grid size-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">{initials}</div>;
}
