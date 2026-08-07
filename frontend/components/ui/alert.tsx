import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900", className)} {...props} />;
}
