import {
  Brain,
  Clock3,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const summary = [
  {
    title: "Predicted Visitors",
    value: "128",
    description: "+12% from yesterday",
    icon: Users,
  },
  {
    title: "Peak Hour",
    value: "10:00 AM",
    description: "Highest expected traffic",
    icon: TrendingUp,
  },
  {
    title: "Average Wait",
    value: "18 mins",
    description: "Estimated waiting time",
    icon: Clock3,
  },
  {
    title: "Forecast Confidence",
    value: "94%",
    description: "High prediction accuracy",
    icon: Brain,
  },
];

export default function ForecastSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-center justify-between p-6">

              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="rounded-full bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}