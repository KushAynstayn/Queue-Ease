
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

import { AnalyticsSummaryData } from "@/types/analytics";

interface AnalyticsSummaryProps {
  data: AnalyticsSummaryData;
}

export default function AnalyticsSummary({
  data,
}: AnalyticsSummaryProps) {
  const summary = [
    {
      title: "Clients Served",
      value: data.clients_served.toLocaleString(),
      description: "Completed queue transactions",
      icon: Users,
    },
    {
      title: "Average Waiting Time",
      value: `${data.average_wait_minutes ?? 0} mins`,
      description: "Average recorded waiting time",
      icon: Clock3,
    },
    {
      title: "Total Queues",
      value: data.total_queues.toLocaleString(),
      description: "Within selected date range",
      icon: CheckCircle2,
    },
    {
      title: "Completion Rate",
      value: `${data.completion_rate}%`,
      description: "Percentage of completed queues",
      icon: Gauge,
    },
  ];

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
