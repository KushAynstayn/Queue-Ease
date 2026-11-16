
"use client";

import {
  CheckCircle2,
  Clock3,
  ListChecks,
  SkipForward,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  statistics: Record<string, number>;
};

const statDefinitions = [
  {
    title: "Waiting",
    key: "waiting",
    description: "Students in queue",
    icon: Clock3,
  },
  {
    title: "Currently Serving",
    key: "serving",
    description: "Active transaction",
    icon: ListChecks,
  },
  {
    title: "Completed",
    key: "completed",
    description: "Served today",
    icon: CheckCircle2,
  },
  {
    title: "Skipped",
    key: "skipped",
    description: "Skipped today",
    icon: SkipForward,
  },
];

export function StaffStats({ statistics }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statDefinitions.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {statistics[stat.key] ?? 0}
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
