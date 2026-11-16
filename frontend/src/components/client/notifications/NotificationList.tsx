"use client";

import {
  BellRing,
  CheckCircle2,
  Clock3,
  Info,
  MessageSquareText,
  Search,
  TriangleAlert,
  RefreshCw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface ClientNotification {
  id: number;
  queue_transaction_id: number | null;
  message_type: string;
  message: string;
  status: "pending" | "sent" | "delivered" | "failed";
  sent_at: string | null;
  delivered_at: string | null;
  error_message: string | null;
  created_at: string;
}

interface NotificationListProps {
  notifications: ClientNotification[];
  loading: boolean;
  error: string;
  search: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

function getNotificationLabel(type: string): string {
  const labels: Record<string, string> = {
    queue_confirmation: "Queue Confirmation",
    queue_update: "Queue Update",
    now_serving: "Now Serving",
    estimated_wait: "Estimated Wait",
    service_delay: "Service Delay",
    service_available: "Service Update",
    manual: "Manual Notification",
  };

  return labels[type] ?? "Notification";
}

function getNotificationTitle(type: string): string {
  const titles: Record<string, string> = {
    queue_confirmation: "Queue request confirmed",
    queue_update: "Queue position updated",
    now_serving: "Queue is now being served",
    estimated_wait: "Estimated waiting time updated",
    service_delay: "Service delay notice",
    service_available: "Service availability update",
    manual: "Notification",
  };

  return titles[type] ?? "Queue notification";
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "queue_update":
      return <BellRing className="h-4 w-4" />;

    case "estimated_wait":
      return <Clock3 className="h-4 w-4" />;

    case "queue_confirmation":
      return <CheckCircle2 className="h-4 w-4" />;

    case "now_serving":
      return <MessageSquareText className="h-4 w-4" />;

    case "service_delay":
    case "service_available":
      return <Info className="h-4 w-4" />;

    default:
      return <BellRing className="h-4 w-4" />;
  }
}

function getStatusLabel(status: ClientNotification["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusStyles(status: ClientNotification["status"]): string {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";

    case "sent":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";

    case "pending":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";

    case "failed":
      return "bg-red-100 text-red-700 hover:bg-red-100";

    default:
      return "";
  }
}

function formatNotificationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  let dateLabel = date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });

  if (isSameDay(date, today)) {
    dateLabel = "Today";
  } else if (isSameDay(date, yesterday)) {
    dateLabel = "Yesterday";
  }

  const timeLabel = date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateLabel} · ${timeLabel}`;
}

export default function NotificationList({
  notifications,
  loading,
  error,
  search,
  onSearchChange,
  currentPage,
  lastPage,
  onPageChange,
  onRetry,
}: NotificationListProps) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-base">
            Notification History
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Review your previous queue-related SMS notifications.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search notifications..."
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <TriangleAlert className="h-6 w-6 text-destructive" />

            <p className="mt-3 text-sm font-medium">
              Unable to load notifications
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {error}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <TriangleAlert className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-medium">
              {search.trim()
                ? "No matching notifications found"
                : "No notifications yet"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {search.trim()
                ? "Try another search term."
                : "Your queue-related notifications will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2845D6]/10 text-[#2845D6]">
                    {getNotificationIcon(notification.message_type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold">
                            {getNotificationTitle(
                              notification.message_type
                            )}
                          </h3>

                          <Badge
                            variant="secondary"
                            className={getStatusStyles(
                              notification.status
                            )}
                          >
                            {getStatusLabel(notification.status)}
                          </Badge>
                        </div>

                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {getNotificationLabel(
                            notification.message_type
                          )}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3 w-3" />

                        <span>
                          {formatNotificationDate(
                            notification.created_at
                          )}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {notification.message}
                    </p>

                    {notification.status === "failed" &&
                      notification.error_message && (
                        <p className="mt-2 text-xs text-destructive">
                          Delivery error: {notification.error_message}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {lastPage > 1 && (
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Page {currentPage} of {lastPage}
                </p>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= lastPage}
                    onClick={() => onPageChange(currentPage + 1)}
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
  );
}