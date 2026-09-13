import {
  Users,
  Clock3,
  CheckCircle2,
  Gauge,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const summary = [
  {
    title: "Total Clients Served",
    value: "4,528",
    description: "Last 30 days",
    icon: Users,
  },
  {
    title: "Average Waiting Time",
    value: "13 mins",
    description: "Across all services",
    icon: Clock3,
  },
  {
    title: "Completed Queues",
    value: "4,211",
    description: "92.9% completion rate",
    icon: CheckCircle2,
  },
  {
    title: "Service Efficiency",
    value: "96%",
    description: "Overall performance",
    icon: Gauge,
  },
];

export default function AnalyticsSummary() {
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