"use client";

import {
  ClipboardList,
  Clock3,
  PlayCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Queue Today",
    value: "248",
    description: "Total queue tickets created",
    icon: ClipboardList,
    color: "text-blue-600",
    bg: "bg-blue-100",
    change: "+12%",
  },
  {
    title: "Waiting",
    value: "37",
    description: "Clients waiting for service",
    icon: Clock3,
    color: "text-amber-600",
    bg: "bg-amber-100",
    change: "+5%",
  },
  {
    title: "Serving",
    value: "18",
    description: "Currently being served",
    icon: PlayCircle,
    color: "text-green-600",
    bg: "bg-green-100",
    change: "+3%",
  },
  {
    title: "Completed",
    value: "211",
    description: "Successfully completed",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    change: "+18%",
  },
  {
    title: "Cancelled",
    value: "6",
    description: "Cancelled queue tickets",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
    change: "-1%",
  },
];

export default function QueueStats() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
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
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`}
              >
                <Icon
                  size={28}
                  className={stat.color}
                />
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              {stat.description}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <ArrowUpRight
                size={15}
                className="text-emerald-500"
              />

              <span className="text-sm font-semibold text-emerald-600">
                {stat.change}
              </span>

              <span className="text-sm text-slate-400">
                vs yesterday
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}