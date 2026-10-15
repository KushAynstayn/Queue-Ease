"use client";

import {
  UserPlus,
  BellRing,
  BrainCircuit,
  ClipboardList,
  ShieldCheck,
  Clock3,
  Activity,
} from "lucide-react";

import type { AdminDashboardData } from "@/services/admin/dashboard.service";

interface RecentActivitiesProps {
  activities: AdminDashboardData["recent_activities"];
}

interface ActivityItem {
  id?: number;
  action?: string;
  description?: string;
  module?: string;
  created_at?: string;
  user?: {
    first_name?: string;
    last_name?: string;
  } | null;
}

function getActivityIcon(module?: string) {
  switch (module?.toLowerCase()) {
    case "users":
      return UserPlus;

    case "sms":
      return BellRing;

    case "forecast":
    case "forecasting":
      return BrainCircuit;

    case "queue":
      return ClipboardList;

    case "security":
      return ShieldCheck;

    default:
      return Activity;
  }
}

function getActivityColor(module?: string) {
  switch (module?.toLowerCase()) {
    case "users":
      return "bg-blue-100 text-blue-600";

    case "sms":
      return "bg-emerald-100 text-emerald-600";

    case "forecast":
    case "forecasting":
      return "bg-violet-100 text-violet-600";

    case "queue":
      return "bg-amber-100 text-amber-600";

    case "security":
      return "bg-red-100 text-red-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatTime(date?: string) {
  if (!date) {
    return "Unknown time";
  }

  const activityDate = new Date(date);

  if (Number.isNaN(activityDate.getTime())) {
    return "Unknown time";
  }

  return activityDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  const activityItems = activities as ActivityItem[];

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

        <button
          className="
            rounded-lg
            border
            border-slate-200
            px-4
            py-2
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-slate-100
          "
        >
          View All
        </button>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-slate-100">
        {activityItems.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Activity
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No recent activities
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Administrator activity will appear here.
            </p>
          </div>
        ) : (
          activityItems.map((activity, index) => {
            const Icon = getActivityIcon(activity.module);

            const color = getActivityColor(activity.module);

            return (
              <div
                key={activity.id ?? index}
                className="
                  flex
                  items-start
                  gap-5
                  px-6
                  py-5
                  transition
                  hover:bg-slate-50
                "
              >
                {/* Icon */}
                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    ${color}
                  `}
                >
                  <Icon size={22} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div
                    className="
                      flex
                      flex-col
                      gap-2
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                    "
                  >
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {activity.action || "System Activity"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {activity.description ||
                          "No description available."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock3 size={16} />

                      <span>
                        {formatTime(activity.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}