"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentActivities from "@/components/dashboard/RecentActivities";

import {
  getAdminDashboard,
  type AdminDashboardData,
} from "@/services/admin/dashboard.service";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();

        setDashboard(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error || "No dashboard data was returned."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader date={dashboard.date} />

      <DashboardStats
        users={dashboard.users}
        queue={dashboard.queue}
        latestForecast={dashboard.latest_forecast}
      />

      <DashboardCharts queue={dashboard.queue} />

      <DashboardCards
        queue={dashboard.queue}
        sms={dashboard.sms}
        latestForecast={dashboard.latest_forecast}
      />

      <RecentActivities activities={dashboard.recent_activities} />
    </div>
  );
}