import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentActivities from "@/components/dashboard/RecentActivities";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <DashboardStats />

      <DashboardCharts />

      <DashboardCards />

      <RecentActivities />
    </div>
  );
}