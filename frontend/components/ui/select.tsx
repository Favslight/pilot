import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100", className)} {...props} />;
}
