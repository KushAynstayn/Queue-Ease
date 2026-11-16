
import { Clock3, MessageSquare } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import type { SmsLog } from "@/app/(dashboard)/staff/sms/page";

interface SmsLogsProps {
  logs: SmsLog[];
  loading: boolean;
}

function getStatusVariant(
  status: string
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "sent":
    case "delivered":
      return "secondary";

    case "failed":
      return "destructive";

    default:
      return "outline";
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString([], {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getFullName(log: SmsLog) {
  return [
    log.first_name,
    log.middle_name,
    log.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function maskPhoneNumber(phone: string) {
  if (!phone) return "—";

  const visibleDigits = phone.slice(-4);

  return `••••••${visibleDigits}`;
}

function formatMessageType(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function SmsLogs({
  logs,
  loading,
}: SmsLogsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Recent SMS Logs</CardTitle>

            <CardDescription>
              Automated SMS notification activity associated with your assigned queues.
            </CardDescription>
          </div>

          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  Time
                </th>

                <th className="px-4 py-3 font-medium">
                  Recipient
                </th>

                <th className="px-4 py-3 font-medium">
                  Queue
                </th>

                <th className="px-4 py-3 font-medium">
                  Message Type
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    Loading SMS logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No SMS notification records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const fullName = getFullName(log);

                  return (
                    <tr
                      key={log.id}
                      className="border-b last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDate(log.created_at)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm font-medium">
                          {fullName || maskPhoneNumber(log.recipient_number)}
                        </p>

                        {fullName && (
                          <p className="text-xs text-muted-foreground">
                            {maskPhoneNumber(log.recipient_number)}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {log.queue_number || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {formatMessageType(log.message_type)}
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={getStatusVariant(log.status)}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          SMS records are automatically updated as notifications are processed.
        </p>
      </CardContent>
    </Card>
  );
}
