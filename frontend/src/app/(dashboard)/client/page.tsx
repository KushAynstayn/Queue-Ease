
"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api";

import ClientWelcome from "@/components/client/dashboard/ClientWelcome";
import ActiveQueueCard from "@/components/client/dashboard/ActiveQueueCard";
import SmsStatusCard from "@/components/client/dashboard/SmsStatusCard";
import QuickActions from "@/components/client/dashboard/QuickActions";
import RecentQueueActivity from "@/components/client/dashboard/RecentQueueActivity";

interface ClientDashboardData {
  client: {
    id: number;
    student_number: string | null;
    notification_preference: string | null;
  };
  active_queue: QueueTransaction | null;
  queue_statistics: {
    total_today: number;
    waiting: number;
    completed_today: number;
  };
  latest_sms: SmsNotification | null;
  recent_activity: QueueTransaction[];
}

interface QueueTransaction {
  id: number;
  queue_number: string;
  queue_date: string;
  status: string;
  estimated_wait_minutes: number | null;
  requested_at: string | null;
  completed_at: string | null;
  service?: {
    id: number;
    name: string;
    code: string;
  } | null;
}

interface SmsNotification {
  id: number;
  queue_transaction_id: number | null;
  message_type: string;
  message: string;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: ClientDashboardData;
}

export default function Page() {
  const [dashboard, setDashboard] = useState<ClientDashboardData | null>(null);
  const [userName, setUserName] = useState("Student");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<DashboardApiResponse>(
        "/client/dashboard"
      );

      setDashboard(response.data);

      const storedUser =
        localStorage.getItem("queue_ease_user") ??
        sessionStorage.getItem("queue_ease_user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as {
            first_name?: string;
          };

          if (user.first_name?.trim()) {
            setUserName(user.first_name.trim());
          }
        } catch {
          // Keep the fallback name if stored user data is invalid.
        }
      }
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="space-y-6">
      <ClientWelcome name={userName} />

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-destructive">{error}</p>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            {loading ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveQueueCard
          queue={dashboard?.active_queue ?? null}
          loading={loading}
        />

        <SmsStatusCard
          notification={dashboard?.latest_sms ?? null}
          loading={loading}
        />
      </div>

      <QuickActions />

      <RecentQueueActivity
        activities={dashboard?.recent_activity ?? []}
        loading={loading}
      />
    </div>
  );
}
