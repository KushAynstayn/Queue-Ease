
"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface SmsStatusCardProps {
  notification: SmsNotification | null;
  loading: boolean;
}

function formatTimestamp(value: string | null) {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusDisplay(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return {
        label: "Delivered",
        className: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle2,
      };

    case "sent":
      return {
        label: "Sent",
        className: "bg-blue-100 text-blue-700",
        icon: CheckCircle2,
      };

    case "pending":
    case "queued":
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        className: "bg-amber-100 text-amber-700",
        icon: Clock3,
      };

    case "failed":
      return {
        label: "Failed",
        className: "bg-red-100 text-red-700",
        icon: XCircle,
      };

    default:
      return {
        label: status || "Unknown",
        className: "bg-muted text-muted-foreground",
        icon: MessageSquareText,
      };
  }
}

export default function SmsStatusCard({
  notification,
  loading,
}: SmsStatusCardProps) {
  const status = notification
    ? getStatusDisplay(notification.status)
    : null;

  const StatusIcon = status?.icon ?? MessageSquareText;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            SMS Notifications
          </CardTitle>

          <MessageSquareText className="h-5 w-5 text-[#2845D6]" />
        </div>

        <p className="text-sm text-muted-foreground">
          Your latest queue notification
        </p>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border bg-muted/30 p-4">
          {loading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Loading your latest notification...
            </p>
          ) : !notification ? (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <MessageSquareText className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="text-sm font-medium">
                No notifications yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Queue notifications will appear here when available.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <StatusIcon className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">
                    {notification.message_type
                      .replace(/[_-]+/g, " ")
                      .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  </p>

                  <Badge
                    variant="secondary"
                    className={status?.className}
                  >
                    {status?.label}
                  </Badge>
                </div>

                <p className="mt-1 break-words text-sm text-muted-foreground">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {notification.delivered_at
                    ? `Delivered ${formatTimestamp(notification.delivered_at)}`
                    : notification.sent_at
                      ? `Sent ${formatTimestamp(notification.sent_at)}`
                      : `Created ${formatTimestamp(notification.created_at)}`}
                </p>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/client/notifications"
          className="mt-3 inline-flex h-10 w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          View Notifications
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
