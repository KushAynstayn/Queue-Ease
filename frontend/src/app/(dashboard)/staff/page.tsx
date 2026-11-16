
"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { QueueItem, QueueStatus } from "@/types/queue";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StaffStats } from "@/components/staff/StaffStats";
import { CurrentServing } from "@/components/staff/CurrentServing";
import { UpcomingQueue } from "@/components/staff/UpcomingQueue";
import { CounterStatus } from "@/components/staff/CounterStatus";
import { QuickActions } from "@/components/staff/QuickActions";



type Counter = {
  id: number;
  service_id: number | null;
  counter_number: string;
  name: string;
  status: "open" | "closed" | "maintenance";
  assigned_staff_id: number | null;
  service?: {
    id: number;
    name: string;
    code: string;
  } | null;
};

type DashboardData = {
  date: string;
  counters: Counter[];
  counter_count: number;
  queue_statistics: Record<QueueStatus, number>;
  active_queues: QueueItem[];
};

type DashboardResponse = {
  success: boolean;
  message: string;
  data: DashboardData;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  return "Unable to load the staff dashboard.";
}

export default function StaffDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await apiRequest<DashboardResponse>(
        "/staff/dashboard"
      );

      if (!response.success || !response.data) {
        throw new Error("The API returned no dashboard data.");
      }

      setDashboard(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const performQueueAction = async (
    endpoint: string,
    method: "POST" | "PUT",
    body?: Record<string, unknown>,
    successMessage?: string
  ) => {
    setProcessing(true);
    setActionError(null);
    setActionMessage(null);

    try {
      await apiRequest(endpoint, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (successMessage) {
        setActionMessage(successMessage);
      }

      await loadDashboard(true);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const callNextStudent = async () => {
    if (!dashboard) return;

    const activeQueue = dashboard.active_queues.some(
      (queue) => queue.status === "called" || queue.status === "serving"
    );

    if (activeQueue) {
      setActionError(
        "A student has already been called or is being served. Finish that transaction before calling another student."
      );
      setActionMessage(null);
      return;
    }

    const openCounter = dashboard.counters.find(
      (counter) =>
        counter.status === "open" &&
        counter.service_id !== null
    );

    if (!openCounter) {
      setActionError(
        "You do not have an open assigned counter with a service. Please check your counter assignment."
      );
      setActionMessage(null);
      return;
    }

    await performQueueAction(
      "/queues/serve-next",
      "POST",
      { counter_id: openCounter.id },
      "Next student called successfully."
    );
  };

  const updateQueueStatus = async (
    queueId: number,
    status: "serving" | "completed" | "skipped"
  ) => {
    await performQueueAction(
      `/queues/${queueId}/status`,
      "PUT",
      { status },
      status === "serving"
        ? "Student marked as currently serving."
        : status === "completed"
          ? "Queue marked as completed."
          : "Queue marked as skipped."
    );
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Staff Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Staff Dashboard
          </h1>
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>

        <Button onClick={() => void loadDashboard()} disabled={refreshing}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!dashboard) return null;

  type CurrentQueueItem = QueueItem & {
    status: "called" | "serving";
  };

  const currentQueue =
    dashboard.active_queues.find(
      (queue): queue is CurrentQueueItem =>
        queue.status === "serving"
    ) ??
    dashboard.active_queues.find(
      (queue): queue is CurrentQueueItem =>
        queue.status === "called"
    ) ??
    null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Staff Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor queues, manage service operations, and assist students.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void loadDashboard(true)}
          disabled={refreshing || processing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          Dashboard refresh failed: {error}
        </p>
      )}

      {actionError && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}

      {actionMessage && (
        <p role="status" className="text-sm text-muted-foreground">
          {actionMessage}
        </p>
      )}

      <StaffStats statistics={dashboard.queue_statistics} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CurrentServing
            queue={currentQueue}
            processing={processing}
            onUpdateStatus={updateQueueStatus}
          />
        </div>

        <CounterStatus counters={dashboard.counters} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingQueue queues={dashboard.active_queues} />
        </div>

        <QuickActions
          processing={processing}
          onCallNext={callNextStudent}
          onRefresh={() => void loadDashboard(true)}
        />
      </div>
    </div>
  );
}
