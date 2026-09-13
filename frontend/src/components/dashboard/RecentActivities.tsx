"use client";

import {
  UserPlus,
  BellRing,
  BrainCircuit,
  ClipboardList,
  ShieldCheck,
  Clock3,
} from "lucide-react";

const activities = [
  {
    title: "New Staff Account Created",
    description: "Maria Santos was added as Queue Staff.",
    time: "5 minutes ago",
    icon: UserPlus,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Queue Monitoring Updated",
    description: "Registrar queue reached 37 waiting clients.",
    time: "12 minutes ago",
    icon: ClipboardList,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "AI Forecast Generated",
    description: "Forecast completed for tomorrow's expected queue demand.",
    time: "25 minutes ago",
    icon: BrainCircuit,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "SMS Notifications Sent",
    description: "189 SMS queue updates were successfully delivered.",
    time: "40 minutes ago",
    icon: BellRing,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Security Audit Completed",
    description: "System permissions and login sessions verified.",
    time: "1 hour ago",
    icon: ShieldCheck,
    color: "bg-red-100 text-red-600",
  },
];

export default function RecentActivities() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Recent Activities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest system events and administrator actions.
          </p>
        </div>

        <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
          View All
        </button>
      </div>

      {/* Timeline */}

      <div className="divide-y divide-slate-100">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex items-start gap-5 px-6 py-5 transition hover:bg-slate-50"
            >
              {/* Icon */}

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${activity.color}`}
              >
                <Icon size={22} />
              </div>

              {/* Content */}

              <div className="flex-1">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {activity.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {activity.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock3 size={16} />

                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}