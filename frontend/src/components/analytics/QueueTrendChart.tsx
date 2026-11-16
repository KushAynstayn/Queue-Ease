
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { QueueTrendData } from "@/types/analytics";

interface QueueTrendChartProps {
  data: QueueTrendData[];
}

export default function QueueTrendChart({
  data,
}: QueueTrendChartProps) {
  const chartData = data.map((item) => ({
    date: item.date,
    total: item.total,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Queue Trend</CardTitle>

        <CardDescription>
          Number of queue transactions during the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
            No queue trend data available.
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Queues"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
