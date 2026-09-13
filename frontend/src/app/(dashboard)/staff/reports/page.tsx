import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ReportSummary } from "@/components/staff/ReportSummary";
import { QueueVolumeChart } from "@/components/staff/QueueVolumeChart";
import { ReportControls } from "@/components/staff/ReportControls";

export default function StaffReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Queue Performance Reports
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review queue performance and service activity.
        </p>
      </div>

      {/* Summary */}
      <ReportSummary />

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Volume by Hour</CardTitle>

          <CardDescription>
            Number of clients served during each service hour.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <QueueVolumeChart />
        </CardContent>
      </Card>

      {/* Report Generation */}
      <ReportControls />
    </div>
  );
}