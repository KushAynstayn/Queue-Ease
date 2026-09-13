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

const forecastData = [
  {
    time: "8 AM",
    demand: 8,
  },
  {
    time: "9 AM",
    demand: 14,
  },
  {
    time: "10 AM",
    demand: 28,
  },
  {
    time: "11 AM",
    demand: 24,
  },
  {
    time: "12 PM",
    demand: 16,
  },
  {
    time: "1 PM",
    demand: 19,
  },
  {
    time: "2 PM",
    demand: 23,
  },
  {
    time: "3 PM",
    demand: 12,
  },
  {
    time: "4 PM",
    demand: 7,
  },
];

export function ForecastChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecasted Queue Demand</CardTitle>

        <CardDescription>
          Expected queue volume throughout the service day.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={forecastData}
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
                dataKey="time"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--background))",
                }}
              />

              <Bar
                dataKey="demand"
                name="Expected Clients"
                radius={[4, 4, 0, 0]}
                fill="hsl(var(--primary))"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}