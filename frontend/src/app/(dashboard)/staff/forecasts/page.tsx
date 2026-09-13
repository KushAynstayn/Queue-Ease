import { ForecastChart } from "@/components/staff/ForecastChart";
import { ForecastOverview } from "@/components/staff/ForecastOverview";
import { PeakHoursCard } from "@/components/staff/PeakHoursCard";

export default function StaffForecastsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Queue Forecasts
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View forecasted queue demand and prepare for peak
          service hours.
        </p>
      </div>

      {/* Forecast Summary */}
      <ForecastOverview />

      {/* Demand Chart + Peak Hours */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ForecastChart />
        </div>

        <PeakHoursCard />
      </div>
    </div>
  );
}