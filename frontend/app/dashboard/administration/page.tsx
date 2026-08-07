"use client";

import { useQuery } from "@tanstack/react-query";
import { Copy, KeyRound, ShieldCheck, Trash2, UserRoundX } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { DataTable } from "@/components/tables/data-table";
import { PermissionMatrix } from "@/components/forms/permission-matrix";
import { assignPermissions, exportCsv, fetchPermissions, fetchRoles, fetchUsers } from "@/services/master.service";

export default function AdministrationPage() {
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const users = useQuery({ queryKey: ["users", search], queryFn: () => fetchUsers(search) });
  const roles = useQuery({ queryKey: ["roles"], queryFn: fetchRoles });
  const permissions = useQuery({ queryKey: ["permissions"], queryFn: fetchPermissions });
  const rows = users.data?.items || [];
  return <div className="space-y-8"><PageHeader title="Administration" description="Manage users, roles, permissions, and administrative access." action={<Button><ShieldCheck className="size-4" />Create User</Button>} /><section className="space-y-4"><TableToolbar search={search} onSearch={setSearch} onExport={() => exportCsv("users.csv", rows)} />{rows.length ? <DataTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3"><input type="checkbox" /></th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last Login</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y">{rows.map((user: any) => <tr key={user.id} className="hover:bg-blue-50/40"><td className="px-4 py-4"><input type="checkbox" /></td><td className="px-4 py-4"><div className="flex items-center gap-3"><Avatar name={user.fullname} /><span className="font-medium">{user.fullname}</span></div></td><td className="px-4 py-4 text-slate-600">{user.email}</td><td className="px-4 py-4">{user.role_name}</td><td className="px-4 py-4"><StatusBadge status={user.status} /></td><td className="px-4 py-4 text-slate-500">{user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</td><td className="px-4 py-4"><div className="flex gap-2"><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><KeyRound className="size-4" /></Button><Button className="size-9 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><UserRoundX className="size-4" /></Button><Button className="size-9 bg-white px-0 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"><Trash2 className="size-4" /></Button></div></td></tr>)}</tbody></DataTable> : <EmptyState title="No users found" />}</section><section className="space-y-4"><PageHeader title="Roles" description="Create, duplicate, and assign permissions to administrative roles." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{(roles.data || []).map((role: any) => <Card key={role.id} className="p-5 transition hover:border-blue-200 hover:bg-blue-50/40"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-950">{role.name}</h3><p className="mt-1 text-sm text-slate-500">{role.description || "Custom administrative role"}</p></div>{role.is_system ? <StatusBadge status="current" /> : null}</div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-500">Users</p><p className="text-xl font-bold">{role.users_count}</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-500">Permissions</p><p className="text-xl font-bold">{role.permissions_count}</p></div></div><div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => setActiveRole(role.id)}>Assign Permissions</Button><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><Copy className="size-4" />Duplicate</Button><Button className="bg-white text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50" disabled={role.is_system}>Delete</Button></div></Card>)}</div></section>{activeRole ? <section className="space-y-4"><PageHeader title="Permission Matrix" description="Grouped by module and saved directly to the selected role." /><PermissionMatrix permissions={permissions.data || []} selected={[]} onSave={(ids) => assignPermissions(activeRole, ids)} /></section> : null}</div>;
}
