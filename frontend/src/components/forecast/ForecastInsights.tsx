import {
  BrainCircuit,
  TrendingUp,
  Users,
  Clock3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const insights = [
  {
    icon: TrendingUp,
    title: "Demand Increase",
    description:
      "Queue demand is expected to increase by approximately 24% between 9:00 AM and 11:00 AM.",
  },
  {
    icon: Users,
    title: "Staff Recommendation",
    description:
      "Consider assigning one additional service staff during the morning peak period.",
  },
  {
    icon: Clock3,
    title: "Waiting Time",
    description:
      "Average waiting time is projected to remain below 20 minutes after 1:00 PM.",
  },
  {
    icon: BrainCircuit,
    title: "AI Observation",
    description:
      "Historical data indicates similar demand patterns every Tuesday, suggesting a recurring peak period.",
  },
];

export default function ForecastInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>

        <CardDescription>
          Forecast observations generated from historical queue data.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {insights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex gap-4 rounded-lg border p-4"
            >
              <div className="rounded-full bg-primary/10 p-3 h-fit">
                <Icon className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h4 className="font-semibold">
                  {item.title}
                </h4>

                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}