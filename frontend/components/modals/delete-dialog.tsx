import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function DeleteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <ConfirmationModal open={open} onClose={onClose} />;
}
