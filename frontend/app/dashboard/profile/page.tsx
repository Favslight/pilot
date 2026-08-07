import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

export default function ProfilePage() {
  return <div className="space-y-6"><PageHeader title="User Profile" description="Manage profile details, password, photo, and login history." /><div className="grid gap-6 xl:grid-cols-[360px_1fr]"><Card className="p-6 text-center"><div className="mx-auto mb-4 w-fit"><Avatar name="Admin User" /></div><h2 className="font-semibold">Admin User</h2><p className="text-sm text-slate-500">Administrator</p><Button className="mt-4 bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-blue-50">Change Photo</Button></Card><Card className="space-y-5 p-6"><h2 className="font-semibold">Profile Details</h2><div className="grid gap-4 md:grid-cols-2"><Input defaultValue="Admin User" placeholder="Full name" /><Input defaultValue="admin@pilot.test" placeholder="Email" /><Input type="password" placeholder="Current password" /><Input type="password" placeholder="New password" /></div><Button>Save Profile</Button></Card></div><Card className="p-6"><h2 className="font-semibold">Login History</h2><div className="mt-4 rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">Latest login activity appears in Activity Logs.</div></Card></div>;
}
