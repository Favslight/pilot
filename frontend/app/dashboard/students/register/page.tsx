import { StudentWizard } from "@/components/forms/student-wizard";
import { PageHeader } from "@/components/ui/page-header";

export default function RegisterStudentPage() {
  return <div className="space-y-6"><PageHeader title="Register Student" description="Complete the multi-step registration wizard. Drafts save automatically until submission." /><StudentWizard /></div>;
}
