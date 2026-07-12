import { DashboardSection } from "@/components/sections/dashboard";

export const metadata = {
  title: "Asset Manager — AssetFlow",
  description: "Operational asset lifecycle management console",
};

export default function AssetManagerDashboardPage() {
  return <DashboardSection initialRole="Asset Manager" />;
}
