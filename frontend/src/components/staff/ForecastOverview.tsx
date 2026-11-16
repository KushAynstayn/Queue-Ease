
import {
  BrainCircuit,
  Clock3,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ForecastResult } from "@/types/forecast";

interface ForecastOverviewProps {
  forecasts: ForecastResult[];
  loading: boolean;
}

export function ForecastOverview({
  forecasts,
  loading,
}: ForecastOverviewProps) {
  const latestForecast = forecasts.reduce<ForecastResult | null>(
    (latest, forecast) => {
      if (!latest) return forecast;

      return new Date(forecast.created_at).getTime() >
        new Date(latest.created_at).getTime()
        ? forecast
        : latest;
    },
    null
  );

  const forecastedDemand = latestForecast?.predicted_transactions;
  const estimatedWait = latestForecast?.predicted_wait_minutes;

  const forecastStats = [
    {
      title: "Forecasted Demand",
      value:
        forecastedDemand != null
          ? `${forecastedDemand} clients`
          : "—",
      description: latestForecast
        ? `For ${latestForecast.forecast_date}`
        : "No saved demand forecast",
      icon: UsersRound,
    },
    {
      title: "Peak Hour",
      value: latestForecast?.predicted_peak_hour ?? "—",
      description: latestForecast?.predicted_peak_hour
        ? "Saved peak-hour forecast"
        : "Peak-hour forecasting unavailable",
      icon: TrendingUp,
    },
    {
      title: "Estimated Wait",
      value:
        estimatedWait != null
          ? `${Number(estimatedWait)} min`
          : "—",
      description: latestForecast
        ? `For ${latestForecast.forecast_date}`
        : "No saved wait-time forecast",
      icon: Clock3,
    },
    {
      title: "Forecast Status",
      value: latestForecast ? "Available" : "Unavailable",
      description: latestForecast
        ? `Model: ${latestForecast.model_name ?? "Not specified"}`
        : "No saved forecast results",
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {forecastStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>

              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "Loading..." : stat.value}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {loading ? "Retrieving forecast data" : stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
