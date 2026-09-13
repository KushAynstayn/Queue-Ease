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

const data = [
  { day: "Mon", clients: 145 },
  { day: "Tue", clients: 188 },
  { day: "Wed", clients: 172 },
  { day: "Thu", clients: 205 },
  { day: "Fri", clients: 224 },
  { day: "Sat", clients: 158 },
];

export default function QueueTrendChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Queue Trend</CardTitle>

        <CardDescription>
          Number of clients served during the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="clients"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}