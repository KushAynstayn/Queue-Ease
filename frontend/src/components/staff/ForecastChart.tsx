
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ForecastingData } from "@/types/forecast";

interface ForecastChartProps {
  historicalData: ForecastingData[];
  loading: boolean;
}

export function ForecastChart({
  historicalData,
  loading,
}: ForecastChartProps) {
  const chartData = [...historicalData]
    .filter((record) => record.total_transactions != null)
    .sort(
      (a, b) =>
        new Date(a.forecast_date).getTime() -
        new Date(b.forecast_date).getTime()
    )
    .map((record) => ({
      date: record.forecast_date,
      demand: Number(record.total_transactions),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Queue Demand</CardTitle>

        <CardDescription>
          Recorded transaction volume by date. These are historical values,
          not AI-generated predictions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[350px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading historical queue data...
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
              No historical demand data is available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(value: string) =>
                    new Date(`${value}T00:00:00`).toLocaleDateString(
                      "en-PH",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )
                  }
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <Tooltip
                  labelFormatter={(value) => `Date: ${String(value)}`}
                  formatter={(value) => [
                    `${value} transactions`,
                    "Recorded Demand",
                  ]}
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--background))",
                  }}
                />

                <Bar
                  dataKey="demand"
                  name="Recorded Transactions"
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
