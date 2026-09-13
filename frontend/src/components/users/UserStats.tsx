"use client";

import {
  ShieldCheck,
  UserCog,
  Users,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Total Users",
    value: 154,
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Administrators",
    value: 3,
    icon: ShieldCheck,
    color: "text-red-500",
  },
  {
    title: "Staff",
    value: 18,
    icon: UserCog,
    color: "text-emerald-600",
  },
  {
    title: "Clients",
    value: 133,
    icon: UserRound,
    color: "text-violet-600",
  },
];

export default function UserStats() {
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
                Registered in the system
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}