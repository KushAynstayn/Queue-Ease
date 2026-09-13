"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
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

const data = [
  { hour: "8 AM", actual: 22, predicted: 24 },
  { hour: "9 AM", actual: 45, predicted: 49 },
  { hour: "10 AM", actual: 78, predicted: 84 },
  { hour: "11 AM", actual: 92, predicted: 98 },
  { hour: "12 PM", actual: 70, predicted: 75 },
  { hour: "1 PM", actual: 65, predicted: 68 },
  { hour: "2 PM", actual: 55, predicted: 58 },
  { hour: "3 PM", actual: 48, predicted: 51 },
];

export default function ForecastChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Queue Forecast</CardTitle>

        <CardDescription>
          Actual queue volume versus AI predicted demand.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="hour" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2563eb"
                strokeWidth={3}
                name="Actual"
              />

              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#7c3aed"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}