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

const stats = [
  {
    title: "Waiting",
    value: "18",
    description: "Students in queue",
    icon: Clock3,
  },
  {
    title: "Currently Serving",
    value: "1",
    description: "Active transaction",
    icon: ListChecks,
  },
  {
    title: "Completed",
    value: "42",
    description: "Served today",
    icon: CheckCircle2,
  },
  {
    title: "Skipped",
    value: "3",
    description: "Skipped today",
    icon: SkipForward,
  },
];

export function StaffStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
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
              <div className="text-2xl font-bold">{stat.value}</div>

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