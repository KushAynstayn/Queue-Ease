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

const forecastStats = [
  {
    title: "Forecasted Demand",
    value: "28",
    description: "Expected clients",
    icon: UsersRound,
  },
  {
    title: "Peak Hour",
    value: "10:00 AM",
    description: "Highest expected demand",
    icon: TrendingUp,
  },
  {
    title: "Estimated Wait",
    value: "24 min",
    description: "During peak period",
    icon: Clock3,
  },
  {
    title: "Forecast Status",
    value: "Ready",
    description: "Latest forecast available",
    icon: BrainCircuit,
  },
];

export function ForecastOverview() {
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
                {stat.value}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}