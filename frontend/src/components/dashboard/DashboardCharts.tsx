"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const queueTrend = [
  { day: "Mon", queues: 95 },
  { day: "Tue", queues: 120 },
  { day: "Wed", queues: 165 },
  { day: "Thu", queues: 145 },
  { day: "Fri", queues: 210 },
  { day: "Sat", queues: 130 },
  { day: "Sun", queues: 90 },
];

const queueStatus = [
  {
    name: "Waiting",
    value: 37,
    color: "#F59E0B",
  },
  {
    name: "Serving",
    value: 18,
    color: "#3B82F6",
  },
  {
    name: "Completed",
    value: 211,
    color: "#10B981",
  },
];

export default function DashboardCharts() {
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
            Number of queue requests received this week.
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={queueTrend}>
              <defs>
                <linearGradient
                  id="queueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2845D6"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="100%"
                    stopColor="#2845D6"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="queues"
                stroke="#2845D6"
                strokeWidth={3}
                fill="url(#queueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
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
            Current queue distribution.
          </p>
        </div>

        <div className="mx-auto h-[260px] w-full">
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
            </PieChart>
          </ResponsiveContainer>
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