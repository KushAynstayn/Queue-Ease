"use client";

import {
  ClipboardList,
  Users,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

import type { AdminDashboardData } from "@/services/admin/dashboard.service";

interface DashboardStatsProps {
  users: AdminDashboardData["users"];
  queue: AdminDashboardData["queue"];
  latestForecast: AdminDashboardData["latest_forecast"];
}

export default function DashboardStats({
  queue,
  latestForecast,
}: DashboardStatsProps) {
  const totalQueue =
    queue.waiting +
    queue.called +
    queue.serving +
    queue.completed +
    queue.cancelled;

  const forecastConfidence =
    latestForecast &&
    typeof latestForecast === "object" &&
    "confidence_score" in latestForecast
      ? Number(latestForecast.confidence_score)
      : null;

  const stats = [
    {
      title: "Queue Today",
      value: totalQueue.toString(),
      description: "Total queue requests today",
      icon: ClipboardList,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Waiting Clients",
      value: queue.waiting.toString(),
      description: "Currently waiting",
      icon: Users,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Completed Services",
      value: queue.completed.toString(),
      description: "Successfully served",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Forecast Confidence",
      value:
        forecastConfidence !== null
          ? `${forecastConfidence.toFixed(1)}%`
          : "N/A",
      description: "Latest AI forecast confidence",
      icon: BrainCircuit,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              group
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-800">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`
                  ${stat.iconBg}
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                `}
              >
                <Icon
                  className={stat.iconColor}
                  size={28}
                />
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              {stat.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}