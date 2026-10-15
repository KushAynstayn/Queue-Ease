"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import type { AdminDashboardData } from "@/services/admin/dashboard.service";

interface DashboardChartsProps {
  queue: AdminDashboardData["queue"];
}

export default function DashboardCharts({
  queue,
}: DashboardChartsProps) {
  const queueStatus = [
    {
      name: "Waiting",
      value: queue.waiting,
      color: "#F59E0B",
    },
    {
      name: "Serving",
      value: queue.serving,
      color: "#3B82F6",
    },
    {
      name: "Completed",
      value: queue.completed,
      color: "#10B981",
    },
  ];

  const hasQueueData = queueStatus.some(
    (item) => item.value > 0
  );

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {/* Queue Trend */}
      <div
        className="
          lg:col-span-2
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Queue Demand Trend
          </h2>

          <p className="text-sm text-slate-500">
            Historical queue trends will be connected through
            the Analytics module.
          </p>
        </div>

        <div className="flex h-[320px] items-center justify-center rounded-xl bg-slate-50">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600">
              Historical trend data is not available yet.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              This will be connected in the Analytics phase.
            </p>
          </div>
        </div>
      </div>

      {/* Queue Status */}
      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Queue Status
          </h2>

          <p className="text-sm text-slate-500">
            Current queue distribution today.
          </p>
        </div>

        <div className="mx-auto h-[260px] w-full">
          {hasQueueData ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={queueStatus}
                  innerRadius={65}
                  outerRadius={90}
                  dataKey="value"
                >
                  {queueStatus.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-400">
                No queue activity yet.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {queueStatus.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="text-sm text-slate-600">
                  {item.name}
                </span>
              </div>

              <span className="font-semibold text-slate-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}