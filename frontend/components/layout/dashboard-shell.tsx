"use client";

import { ReactNode, useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return <div className="min-h-screen bg-gray-50 lg:flex"><Sidebar collapsed={collapsed} /><div className="min-w-0 flex-1"><Header collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} /><main className="p-4 sm:p-6 lg:p-8">{children}</main></div></div>;
}
