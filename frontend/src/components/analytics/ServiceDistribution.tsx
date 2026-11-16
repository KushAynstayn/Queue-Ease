
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ServiceDistributionData } from "@/types/analytics";

interface ServiceDistributionProps {
  data: ServiceDistributionData[];
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#0891b2",
];

export default function ServiceDistribution({
  data,
}: ServiceDistributionProps) {
  const chartData = data.map((item) => ({
    name: item.service_name,
    total: item.total,
    percentage: item.percentage,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Service Distribution</CardTitle>

        <CardDescription>
          Distribution of queue transactions by service.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
            No service distribution data available.
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={105}
                  label={({ name, payload }) =>
                    `${name}: ${payload.percentage}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `${value} queues`,
                    name,
                  ]}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
