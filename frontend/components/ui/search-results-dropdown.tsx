"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { globalSearch } from "@/services/report.service";

export function SearchResultsDropdown() {
  const [q, setQ] = useState("");
  const results = useQuery({ queryKey: ["global-search", q], queryFn: () => globalSearch(q), enabled: q.trim().length > 1 });
  return <div className="relative w-full max-w-md"><SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input className="pl-9" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search students, staff, classes..." />{q.length > 1 ? <div className="absolute top-12 z-50 w-full overflow-hidden rounded-lg border bg-white shadow-xl"><div className="max-h-80 overflow-y-auto py-2">{(results.data || []).length ? (results.data || []).map((item: any, index: number) => <button key={`${item.module}-${item.id}`} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-blue-50" autoFocus={index === 0}><span className="font-medium text-slate-800">{item.label}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{item.module}</span></button>) : <p className="px-4 py-3 text-sm text-slate-500">No results found</p>}</div></div> : null}</div>;
}
