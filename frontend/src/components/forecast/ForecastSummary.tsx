
import { Brain, Clock3, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ForecastTarget } from "./ForecastFilters";

export interface ForecastResult {
  id?: number;
  service_id: number;
  forecast_date: string;
  predicted_transactions: number | null;
  predicted_wait_minutes: number | null;
  predicted_peak_hour?: string | null;
  model_name?: string | null;
  model_version?: string | null;
  confidence_score?: number | null;
}

interface ForecastSummaryProps {
  forecast: ForecastResult | null;
  target: ForecastTarget;
}

export default function ForecastSummary({
  forecast,
  target,
}: ForecastSummaryProps) {
  const isTransactions = target === "total_transactions";

  const summary = [
    {
      title: isTransactions ? "Predicted Transactions" : "Predicted Visitors",
      value:
        forecast && forecast.predicted_transactions !== null
          ? String(forecast.predicted_transactions)
          : "—",
      description: "Experimental transaction-count prediction",
      icon: Users,
    },
    {
      title: "Forecast Date",
      value: forecast?.forecast_date ?? "—",
      description: "Requested prediction date",
      icon: TrendingUp,
    },
    {
      title: "Average Wait",
      value:
        forecast?.predicted_wait_minutes !== null &&
        forecast?.predicted_wait_minutes !== undefined
          ? `${forecast.predicted_wait_minutes} mins`
          : "—",
      description: "Experimental waiting-time prediction",
      icon: Clock3,
    },
    {
      title: "Model",
      value: forecast?.model_name ?? "—",
      description: forecast?.model_version ?? "No forecast generated",
      icon: Brain,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="mt-2 break-words text-2xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="ml-3 rounded-full bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
