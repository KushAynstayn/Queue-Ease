
"use client";

import { useCallback, useEffect, useState } from "react";
import { PhoneCall, RefreshCw } from "lucide-react";

import { apiRequest, ApiRequestError } from "@/lib/api";
import type {
  QueueFiltersValue,
  QueueItem,
  QueueService,
} from "@/types/queue";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QueueFilters } from "@/components/staff/QueueFilters";
import { QueueTable } from "@/components/staff/QueueTable";
import { ServeNextDialog } from "@/components/staff/ServeNextDialog";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type PaginatedQueues = {
  data: QueueItem[];
  current_page: number;
  last_page: number;
  total: number;
};

type StaffCounter = {
  id: number;
  name: string;
  counter_number: string | number;
  status: string;
};

type StaffDashboard = {
  counters: StaffCounter[];
};

const initialFilters: QueueFiltersValue = {
  search: "",
  status: "all",
  serviceId: "all-services",
};

function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

export default function StaffQueuePage() {
  const [filters, setFilters] =
    useState<QueueFiltersValue>(initialFilters);

  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [services, setServices] = useState<QueueService[]>([]);
  const [counters, setCounters] = useState<StaffCounter[]>([]);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [serveNextOpen, setServeNextOpen] = useState(false);
  const [serveNextProcessing, setServeNextProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadQueues = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        queue_date: getToday(),
        per_page: "100",
      });

      if (filters.status !== "all") {
        params.set("status", filters.status ?? "all");
      }

      if (
        filters.serviceId !== "all-services" &&
        filters.serviceId !== ""
      ) {
        params.set("service_id", filters.serviceId ?? "all-services");
      }

      if (filters.search.trim()) {
        params.set("search", filters.search.trim());
      }

      const response = await apiRequest<
        ApiResponse<PaginatedQueues>
      >(`/queues?${params.toString()}`);

      setQueues(response.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadPageData = useCallback(async () => {
    setError(null);

    try {
      const [serviceResponse, dashboardResponse] = await Promise.all([
        apiRequest<ApiResponse<QueueService[]>>("/services"),
        apiRequest<ApiResponse<StaffDashboard>>("/staff/dashboard"),
      ]);

      setServices(serviceResponse.data);
      setCounters(dashboardResponse.data.counters ?? []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    void loadPageData();
  }, [loadPageData]);

  useEffect(() => {
    void loadQueues();
  }, [loadQueues]);

  async function handleUpdateStatus(
    queueId: number,
    status: "serving" | "completed" | "skipped"
  ): Promise<void> {
    setProcessingId(queueId);
    setError(null);
    setNotice(null);

    try {
      const response = await apiRequest<ApiResponse<QueueItem>>(
        `/queues/${queueId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status }),
        }
      );

      setNotice(response.message);
      await loadQueues();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setProcessingId(null);
    }
  }

  async function handleServeNext(): Promise<void> {
    const openCounter = counters.find(
      (counter) => counter.status === "open"
    );

    if (!openCounter) {
      setError(
        "You do not have an assigned open counter. Open or assign a counter before calling the next student."
      );
      return;
    }

    setServeNextProcessing(true);
    setError(null);
    setNotice(null);

    try {
      const response = await apiRequest<ApiResponse<QueueItem>>(
        "/queues/serve-next",
        {
          method: "POST",
          body: JSON.stringify({ counter_id: openCounter.id }),
        }
      );

      setNotice(response.message);
      setServeNextOpen(false);
      await loadQueues();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setServeNextProcessing(false);
    }
  }

  const openCounter = counters.find(
    (counter) => counter.status === "open"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Queue Management
            </h1>

            <Badge variant="secondary">
              {openCounter
                ? `${openCounter.name} (${openCounter.counter_number})`
                : "No Open Counter"}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage today&apos;s student queue.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => void loadQueues()}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={() => setServeNextOpen(true)}
            disabled={!openCounter || serveNextProcessing}
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            Call Next
          </Button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-md border p-3 text-sm"
        >
          {notice}
        </div>
      )}

      <QueueFilters
        filters={filters}
        services={services}
        onChange={setFilters}
      />

      <QueueTable
        queues={queues}
        loading={loading}
        processingId={processingId}
        onUpdateStatus={handleUpdateStatus}
      />

      <ServeNextDialog
        open={serveNextOpen}
        onOpenChange={setServeNextOpen}
        processing={serveNextProcessing}
        onConfirm={handleServeNext}
      />
    </div>
  );
}
