"use client";

import { useQuery } from "@tanstack/react-query";
import { PackagePlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { exportCsv, fetchAssets } from "@/services/master.service";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const assets = useQuery({ queryKey: ["assets", search], queryFn: () => fetchAssets(search) });
  const rows = assets.data?.items || [];
  return <div className="space-y-6"><PageHeader title="School Assets" description="Lightweight institutional asset register for school-owned equipment." action={<Button><PackagePlus className="size-4" />Register Asset</Button>} /><TableToolbar search={search} onSearch={setSearch} onExport={() => exportCsv("school-assets.csv", rows)} />{rows.length ? <DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Asset Code</th><th className="px-4 py-3">Asset Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Condition</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y">{rows.map((asset: any) => <tr key={asset.id}><td className="px-4 py-4 font-semibold text-blue-700">{asset.asset_code}</td><td className="px-4 py-4 font-medium">{asset.asset_name}</td><td className="px-4 py-4">{asset.category}</td><td className="px-4 py-4">{asset.condition}</td><td className="px-4 py-4">{asset.current_location}</td><td className="px-4 py-4"><StatusBadge status={asset.status} /></td></tr>)}</tbody></DataTable> : <EmptyState title="No assets found" />}</div>;
}
