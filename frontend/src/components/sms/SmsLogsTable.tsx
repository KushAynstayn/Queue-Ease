"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  getSmsNotifications,
  SmsNotification,
} from "@/lib/sms";

function formatMessageType(type: string) {
  const labels: Record<string, string> = {
    queue_confirmation: "Queue Confirmation",
    queue_update: "Queue Update",
    now_serving: "Now Serving",
    estimated_wait: "Estimated Wait",
    service_delay: "Service Delay",
    service_available: "Service Available",
    manual: "Manual",
  };

  return labels[type] ?? type;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function maskPhoneNumber(number: string) {
  if (!number || number.length < 4) {
    return number;
  }

  return `${"*".repeat(number.length - 4)}${number.slice(-4)}`;
}

function getStatusVariant(
  status: SmsNotification["status"]
) {
  switch (status) {
    case "delivered":
      return "default";

    case "sent":
      return "secondary";

    case "failed":
      return "destructive";

    default:
      return "outline";
  }
}

export default function SmsLogsTable() {
  const [logs, setLogs] = useState<SmsNotification[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await getSmsNotifications(targetPage);
      const pagination = response.data;

      setLogs(pagination.data);
      setPage(pagination.current_page);
      setLastPage(pagination.last_page);
      setTotal(pagination.total);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve SMS notification logs."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLogs(1);
  }, [loadLogs]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Recent SMS Logs</CardTitle>

          <CardDescription>
            Review automated SMS notification records.
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void loadLogs(page)}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Message Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center">
                    Loading SMS records...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No SMS notification records found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {maskPhoneNumber(log.recipient_number)}
                    </TableCell>

                    <TableCell>
                      {formatMessageType(log.message_type)}
                    </TableCell>

                    <TableCell className="max-w-[280px]">
                      <p className="truncate" title={log.message}>
                        {log.message}
                      </p>
                    </TableCell>

                    <TableCell>
                      <Badge variant={getStatusVariant(log.status)}>
                        {log.status.charAt(0).toUpperCase() +
                          log.status.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {logs.length} of {total} notification records.
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={loading || page <= 1}
              onClick={() => void loadLogs(page - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={loading || page >= lastPage}
              onClick={() => void loadLogs(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}