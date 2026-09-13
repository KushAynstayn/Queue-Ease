import { StaffStats } from "@/components/staff/StaffStats";
import { CurrentServing } from "@/components/staff/CurrentServing";
import { UpcomingQueue } from "@/components/staff/UpcomingQueue";
import { CounterStatus } from "@/components/staff/CounterStatus";
import { QuickActions } from "@/components/staff/QuickActions";

export default function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Staff Dashboard
        </h1>

        <p className="text-sm text-muted-foreground">
          Monitor queues, manage service operations, and assist students.
        </p>
      </div>

      {/* Statistics */}
      <StaffStats />

      {/* Current Serving + Counter */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CurrentServing />
        </div>

        <CounterStatus />
      </div>

      {/* Upcoming Queue + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingQueue />
        </div>

        <QuickActions />
      </div>
    </div>
  );
}