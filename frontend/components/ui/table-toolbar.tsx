import { Download, SearchIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

export function TableToolbar({ search, onSearch, onExport }: { search: string; onSearch: (value: string) => void; onExport?: () => void }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full max-w-md"><SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input className="pl-9" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search and filter..." /></div>{onExport ? <Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50" onClick={onExport}><Download className="size-4" />Export CSV</Button> : null}</div>;
}
