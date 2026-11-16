
"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    queue: {
      total: number;
      waiting: number;
      called: number;
      serving: number;
      completed: number;
      cancelled: number;
    };
  };
}

export default function QueueStats() {
  const [queue, setQueue] = useState<DashboardResponse["data"]["queue"] | null>(
    null
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    apiRequest<DashboardResponse>("/admin/dashboard")
      .then((response) => {
        if (active) setQueue(response.data.queue);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      title: "Queue Today",
      value: queue?.total,
      description: "Total queue tickets created today",
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Waiting",
      value: queue?.waiting,
      description: "Clients waiting for service",
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Serving",
      value: queue?.serving,
      description: "Currently being served",
      icon: PlayCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Completed",
      value: queue?.completed,
      description: "Successfully completed today",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Cancelled",
      value: queue?.cancelled,
      description: "Cancelled queue tickets today",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-800">
                  {stat.value === undefined ? "—" : stat.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`}
              >
                <Icon size={28} className={stat.color} />
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">{stat.description}</p>
          </div>
        );
      })}

      {error && (
        <p className="text-sm text-red-600 md:col-span-2 xl:col-span-5">
          Dashboard statistics could not be loaded. Check your login and API connection.
        </p>
      )}
    </section>
  );
}
