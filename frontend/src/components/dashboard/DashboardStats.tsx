"use client";

import {
  ClipboardList,
  Users,
  CheckCircle2,
  BrainCircuit,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Queue Today",
    value: "248",
    description: "Total queue requests today",
    change: "+12%",
    icon: ClipboardList,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Waiting Clients",
    value: "37",
    description: "Currently waiting",
    change: "+5%",
    icon: Users,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Completed Services",
    value: "211",
    description: "Successfully served",
    change: "+18%",
    icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Forecast Accuracy",
    value: "96.4%",
    description: "AI prediction performance",
    change: "+1.2%",
    icon: BrainCircuit,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

export default function DashboardStats() {
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

            <div className="mt-4 flex items-center gap-2">
              <ArrowUpRight
                size={16}
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