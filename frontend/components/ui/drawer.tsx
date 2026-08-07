import { ReactNode } from "react";

export function Drawer({ open, children }: { open: boolean; children: ReactNode }) {
  return <aside className={open ? "fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:static lg:shadow-none" : "hidden lg:block lg:w-20"}>{children}</aside>;
}
