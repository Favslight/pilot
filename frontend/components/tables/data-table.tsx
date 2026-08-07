import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";

export function DataTable({ children }: { children: ReactNode }) {
  return <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm">{children}</table></div><div className="border-t px-4"><Pagination /></div></Card>;
}
