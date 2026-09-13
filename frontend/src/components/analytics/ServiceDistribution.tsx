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

const data = [
  {
    name: "Registrar",
    value: 42,
  },
  {
    name: "Cashier",
    value: 28,
  },
  {
    name: "Admission",
    value: 18,
  },
  {
    name: "Others",
    value: 12,
  },
];

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
];

export default function ServiceDistribution() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Service Distribution</CardTitle>

        <CardDescription>
          Percentage of queue requests by service.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}