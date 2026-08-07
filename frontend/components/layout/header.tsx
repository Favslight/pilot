"use client";

import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchResultsDropdown } from "@/components/ui/search-results-dropdown";

export function Header({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white/90 px-4 backdrop-blur"><Button className="hidden size-10 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50 lg:inline-flex" onClick={onToggle}><Icon className="size-5" /></Button><Button className="size-10 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50 lg:hidden"><Menu className="size-5" /></Button><SearchResultsDropdown /><div className="ml-auto flex items-center gap-3"><Button className="size-10 bg-white px-0 text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50"><Bell className="size-5" /></Button><Avatar name="Admin User" /></div></header>;
}
