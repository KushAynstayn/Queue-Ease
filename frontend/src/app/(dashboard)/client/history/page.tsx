"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  History,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { apiRequest, ApiRequestError } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QueueHistoryItem {
  id: number;
  queue_number: string;
  queue_date: string;
  status: string;
  actual_wait_minutes: number | null;
  estimated_wait_minutes: number | null;
  requested_at: string | null;
  created_at: string;
  service: {
    id: number;
    name: string;
    code: string;
  } | null;
}

interface PaginatedQueueHistory {
  data: QueueHistoryItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface QueueHistoryApiResponse {
  success: boolean;
  message: string;
  data: PaginatedQueueHistory;
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusStyles(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";

    case "cancelled":
      return "bg-red-100 text-red-700 hover:bg-red-100";

    case "skipped":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function StatusIcon({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;

    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;

    case "skipped":
      return <AlertCircle className="h-4 w-4 text-amber-600" />;

    default:
      return <History className="h-4 w-4 text-muted-foreground" />;
  }
}

function formatQueueDate(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatQueueTime(dateValue: string | null): string {
  if (!dateValue) return "Time unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Page() {
  const [history, setHistory] = useState<QueueHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await apiRequest<QueueHistoryApiResponse>(
          `/client/queue-history?page=${currentPage}`
        );

      setHistory(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotalRecords(response.data.total);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Unable to retrieve your queue history."
      );

      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[#2845D6]" />

          <span className="text-sm font-medium text-muted-foreground">
            Queue
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Queue History
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View your previous enrollment queue transactions.
        </p>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Previous Queues
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Your recently completed and cancelled queue requests.
          </p>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-[180px] items-center justify-center text-sm text-muted-foreground">
              Loading queue history...
            </div>
          ) : error ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />

              <p className="mt-3 text-sm font-medium">
                Unable to load queue history
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {error}
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={fetchHistory}
              >
                Try Again
              </Button>
            </div>
          ) : history.length === 0 ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
              <History className="h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No queue history
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Your previous queue transactions will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {history.map((queue) => {
                  const queueDate =
                    queue.requested_at ?? queue.created_at;

                  return (
                    <div
                      key={queue.id}
                      className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Queue Details */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <StatusIcon status={queue.status} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold">
                              {queue.queue_number}
                            </h3>

                            <Badge
                              variant="secondary"
                              className={getStatusStyles(queue.status)}
                            >
                              {formatStatus(queue.status)}
                            </Badge>
                          </div>

                          <p className="mt-1 text-sm">
                            {queue.service?.name ?? "Unknown service"}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock3 className="h-3 w-3" />

                            <span>
                              {formatQueueDate(queue.queue_date)} ·{" "}
                              {formatQueueTime(queueDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actual Waiting Time */}
                      <div className="sm:text-right">
                        <p className="text-xs text-muted-foreground">
                          Waiting Time
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {queue.actual_wait_minutes !== null
                            ? `${queue.actual_wait_minutes} minutes`
                            : "—"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    Showing page {currentPage} of {lastPage}
                    {" · "}
                    {totalRecords} records
                  </p>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((page) => page - 1)}
                    >
                      Previous
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= lastPage}
                      onClick={() => setCurrentPage((page) => page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}