import ClientWelcome from "@/components/client/dashboard/ClientWelcome";
import ActiveQueueCard from "@/components/client/dashboard/ActiveQueueCard";
import SmsStatusCard from "@/components/client/dashboard/SmsStatusCard";
import QuickActions from "@/components/client/dashboard/QuickActions";
import RecentQueueActivity from "@/components/client/dashboard/RecentQueueActivity";

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <ClientWelcome name="Student" />

      {/* Current Queue + SMS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveQueueCard />
        <SmsStatusCard />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Queue Activity */}
      <RecentQueueActivity />
    </div>
  );
}