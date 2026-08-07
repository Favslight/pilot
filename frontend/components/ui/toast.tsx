import { ToastKind } from "@/hooks/use-toast";

const styles: Record<ToastKind, string> = {
  success: "bg-emerald-600",
  error: "bg-rose-600",
  warning: "bg-amber-500",
  info: "bg-slate-900",
};

export function Toast({ message, kind = "info" }: { message: string; kind?: ToastKind }) {
  return <div role="status" aria-live="polite" className={`fixed bottom-5 right-5 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-xl ${styles[kind]}`}>{message}</div>;
}
