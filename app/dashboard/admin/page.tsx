import { DashboardSection } from "@/components/sections/dashboard";

export const metadata = {
  title: "System Admin — AssetFlow",
  description: "Organization management console for admins",
};

export default function AdminDashboardPage() {
  return <DashboardSection initialRole="Admin" />;
}
