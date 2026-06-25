import AdminShell from "@/components/layout/AdminShell";
import DashboardClient from "@/components/dashboard/DashboardClient";
export const metadata = { title: "Dashboard" };
export default function DashboardPage() {
  return (
    <AdminShell>
      <DashboardClient />
    </AdminShell>
  );
}
