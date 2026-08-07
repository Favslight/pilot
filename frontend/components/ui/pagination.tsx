import { Button } from "./button";

export function Pagination() {
  return <div className="flex items-center justify-between gap-3 py-4 text-sm text-slate-600"><span>Page 1 of 1</span><div className="flex gap-2"><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50">Previous</Button><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50">Next</Button></div></div>;
}
