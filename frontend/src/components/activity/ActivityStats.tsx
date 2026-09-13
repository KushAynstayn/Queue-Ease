"use client";

import {
  Activity,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Total Activities",
    value: 842,
    icon: Activity,
    color: "text-blue-600",
    description: "Recorded system logs",
  },
  {
    title: "Today's Activities",
    value: 47,
    icon: CalendarDays,
    color: "text-violet-600",
    description: "Activities today",
  },
  {
    title: "Successful Actions",
    value: 811,
    icon: CheckCircle2,
    color: "text-emerald-600",
    description: "Completed successfully",
  },
  {
    title: "Failed Actions",
    value: 31,
    icon: AlertTriangle,
    color: "text-red-600",
    description: "Require review",
  },
];

export default function ActivityStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="transition-all duration-200 hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>

              <Icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {stat.value}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}