import { ReactNode } from "react";
import { Button } from "./button";

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="presentation"><div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><Button aria-label="Close modal" className="size-9 bg-slate-100 px-0 text-slate-700 hover:bg-slate-200" onClick={onClose}>×</Button></div>{children}</div></div>;
}
