
"use client";

import {
  Clock3,
  MessageSquare,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReportSummaryProps {
  totalClientsServed: number;
  averageWaitMinutes: number;
  peakHour: string | null;
  smsSent: number;
  loading: boolean;
}

export function ReportSummary({
  totalClientsServed,
  averageWaitMinutes,
  peakHour,
  smsSent,
  loading,
}: ReportSummaryProps) {
  const reportStats = [
    {
      title: "Total Clients Served",
      value: totalClientsServed.toLocaleString(),
      description: "Clients served today",
      icon: UsersRound,
    },
    {
      title: "Average Wait Time",
      value: `${averageWaitMinutes} min`,
      description: "Average client waiting time",
      icon: Clock3,
    },
    {
      title: "Peak Hour",
      value: peakHour ?? "N/A",
      description: "Highest completed queue volume",
      icon: TrendingUp,
    },
    {
      title: "SMS Sent",
      value: smsSent.toLocaleString(),
      description: "Sent or delivered notifications today",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {reportStats.map((stat) => {
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
                {loading ? "..." : stat.value}
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
