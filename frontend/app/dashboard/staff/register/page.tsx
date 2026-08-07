import { StaffWizard } from "@/components/forms/staff-wizard";
import { PageHeader } from "@/components/ui/page-header";

export default function RegisterStaffPage() {
  return <div className="space-y-6"><PageHeader title="Register Staff" description="Capture personal, employment, and passport information for a permanent staff record." /><StaffWizard /></div>;
}
