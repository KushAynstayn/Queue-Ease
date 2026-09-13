import ForecastFilters from "@/components/forecast/ForecastFilters";
import ForecastSummary from "@/components/forecast/ForecastSummary";
import ForecastChart from "@/components/forecast/ForecastChart";
import PeakHoursCard from "@/components/forecast/PeakHoursCard";
import PredictionTable from "@/components/forecast/PredictionTable";
import ForecastInsights from "@/components/forecast/ForecastInsights";
import AccuracyCard from "@/components/forecast/AccuracyCard";
import ForecastLegend from "@/components/forecast/ForecastLegend";

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          AI Forecasting
        </h1>

        <p className="mt-2 text-muted-foreground">
          Predict future queue demand, estimated waiting time, and peak service
          hours using AI-powered forecasting.
        </p>
      </div>

      {/* Forecast Filters */}
      <ForecastFilters />

      {/* Summary Cards */}
      <ForecastSummary />

      {/* Forecast Chart + Peak Hours */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ForecastChart />
        </div>

        <PeakHoursCard />
      </div>

      {/* Prediction Table */}
      <PredictionTable />

      {/* AI Insights */}
      <ForecastInsights />

      {/* Bottom Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AccuracyCard />

        <ForecastLegend />
      </div>
    </div>
  );
}