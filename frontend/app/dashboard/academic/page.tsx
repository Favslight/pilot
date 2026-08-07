"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { fetchClasses, fetchSessions, fetchTerms } from "@/services/master.service";

export default function AcademicPage() {
  const [search, setSearch] = useState("");
  const sessions = useQuery({ queryKey: ["sessions", search], queryFn: () => fetchSessions(search) });
  const terms = useQuery({ queryKey: ["terms"], queryFn: () => fetchTerms("") });
  const classes = useQuery({ queryKey: ["classes"], queryFn: () => fetchClasses("") });
  const sessionRows = sessions.data?.items || [];
  return <div className="space-y-8"><PageHeader title="Academic Master Data" description="Configure academic sessions, terms, classes, and academic order." action={<Button><Plus className="size-4" />Add Session</Button>} /><TableToolbar search={search} onSearch={setSearch} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sessionRows.length ? sessionRows.map((session: any) => <Card key={session.id} className="p-5 transition hover:border-blue-200 hover:bg-blue-50/40"><div className="flex items-start justify-between"><div><h3 className="text-lg font-bold">{session.session_name}</h3><p className="text-sm text-slate-500">Academic Session</p></div><StatusBadge status={session.is_current ? "Current" : session.status} /></div><div className="mt-5 flex gap-2"><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><CalendarCheck className="size-4" />Set Current</Button><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50">Edit</Button></div></Card>) : <EmptyState title="No sessions found" />}</div><section className="grid gap-6 xl:grid-cols-2"><DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Term</th><th className="px-4 py-3">Dates</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y">{(terms.data?.items || []).map((term: any) => <tr key={term.id}><td className="px-4 py-4 font-medium">{term.term_name}</td><td className="px-4 py-4 text-slate-600">{term.start_date} to {term.end_date}</td><td className="px-4 py-4"><StatusBadge status={term.status} /></td></tr>)}</tbody></DataTable><DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Class</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Order</th></tr></thead><tbody className="divide-y">{(classes.data?.items || []).map((klass: any) => <tr key={klass.id}><td className="px-4 py-4 font-medium">{klass.name}</td><td className="px-4 py-4">{klass.level}</td><td className="px-4 py-4">{klass.display_order}</td></tr>)}</tbody></DataTable></section></div>;
}
