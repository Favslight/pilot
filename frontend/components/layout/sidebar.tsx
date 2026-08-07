"use client";

import { Activity, BarChart3, BookOpen, GraduationCap, LayoutDashboard, LogOut, Package, Settings, Shield, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Students", icon: GraduationCap, href: "/dashboard/students" },
  { label: "Staff", icon: UsersRound, href: "/dashboard/staff" },
  { label: "Assets", icon: Package, href: "/dashboard/assets" },
  { label: "Academic", icon: BookOpen, href: "/dashboard/academic" },
  { label: "Academic Records", icon: BookOpen, href: "/dashboard/academic/records" },
  { label: "Student Promotion", icon: GraduationCap, href: "/dashboard/academic/promotion" },
  { label: "Reports", icon: BarChart3, href: "/dashboard/reports" },
  { label: "Activity Logs", icon: Activity, href: "/dashboard/activity" },
  { label: "Administration", icon: Shield, href: "/dashboard/administration" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { label: "Profile", icon: UsersRound, href: "/dashboard/profile" },
];

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };
  return <aside className={cn("hidden border-r bg-white transition-all lg:flex lg:min-h-screen lg:flex-col", collapsed ? "lg:w-20" : "lg:w-72")}><div className="flex h-16 items-center gap-3 border-b px-5"><div className="grid size-10 place-items-center rounded-lg bg-blue-600 font-bold text-white">P</div>{!collapsed && <span className="font-bold text-slate-950">Pilot Records</span>}</div><nav className="flex-1 space-y-1 p-3">{items.map((item) => <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"><item.icon className="size-5" />{!collapsed && item.label}</Link>)}</nav><button onClick={logout} className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"><LogOut className="size-5" />{!collapsed && "Logout"}</button></aside>;
}
