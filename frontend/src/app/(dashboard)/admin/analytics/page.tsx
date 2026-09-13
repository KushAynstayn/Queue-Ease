import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import QueueTrendChart from "@/components/analytics/QueueTrendChart";
import ServiceDistribution from "@/components/analytics/ServiceDistribution";
import PerformanceMetrics from "@/components/analytics/PerformanceMetrics";
import PeakDayCard from "@/components/analytics/PeakDayCard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Queue Analytics
        </h1>

        <p className="mt-2 text-muted-foreground">
          Analyze historical queue performance, service efficiency,
          and operational trends across all services.
        </p>
      </div>

      {/* Filters */}
      <AnalyticsFilters />

      {/* Summary Cards */}
      <AnalyticsSummary />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QueueTrendChart />
        </div>

        <ServiceDistribution />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceMetrics />
        </div>

        <PeakDayCard />
      </div>
    </div>
  );
}