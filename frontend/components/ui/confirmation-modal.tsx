import { Modal } from "./modal";
import { Button } from "./button";

export function ConfirmationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Modal open={open} title="Confirm action" onClose={onClose}><p className="text-sm text-slate-600">This action requires confirmation.</p><div className="mt-5 flex justify-end gap-2"><Button className="bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-gray-50" onClick={onClose}>Cancel</Button><Button>Confirm</Button></div></Modal>;
}
