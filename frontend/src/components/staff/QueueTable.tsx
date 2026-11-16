
"use client";

import { Clock3, UserRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QueueActions } from "./QueueActions";

import type { QueueItem, QueueStatus } from "@/types/queue";

type Props = {
  queues: QueueItem[];
  loading: boolean;
  processingId: number | null;
  onUpdateStatus: (
    queueId: number,
    status: "serving" | "completed" | "skipped"
  ) => Promise<void>;
};

function getStatusLabel(status: QueueStatus) {
  const labels: Record<QueueStatus, string> = {
    waiting: "Waiting",
    called: "Called",
    serving: "Serving",
    completed: "Completed",
    skipped: "Skipped",
    cancelled: "Cancelled",
    no_show: "No Show",
  };

  return labels[status];
}

function getStatusVariant(
  status: QueueStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "serving":
    case "called":
      return "default";
    case "completed":
      return "secondary";
    case "skipped":
    case "cancelled":
    case "no_show":
      return "destructive";
    default:
      return "outline";
  }
}

export function QueueTable({
  queues,
  loading,
  processingId,
  onUpdateStatus,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Queue List</CardTitle>
            <CardDescription>
              Monitor and manage students in the queue.
            </CardDescription>
          </div>

          <Badge variant="secondary">
            {queues.length} Queue Records
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 font-medium">Queue #</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Waiting Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    Loading queue records...
                  </td>
                </tr>
              ) : queues.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    No queue records match your filters.
                  </td>
                </tr>
              ) : (
                queues.map((queue) => {
                  const studentName = [
                    queue.first_name,
                    queue.middle_name,
                    queue.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <tr
                      key={queue.id}
                      className="border-b last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-4 py-4">
                        <span className="font-semibold">
                          {queue.queue_number}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                            <UserRound className="h-4 w-4 text-muted-foreground" />
                          </div>

                          <div>
                            <p className="font-medium">
                              {studentName ||
                                queue.student_number ||
                                "Student details unavailable"}
                            </p>
                            {studentName && queue.student_number && (
                              <p className="text-xs text-muted-foreground">
                                {queue.student_number}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {queue.service_name || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          {queue.estimated_wait_minutes == null
                            ? "Not available"
                            : `${queue.estimated_wait_minutes} min`}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={getStatusVariant(queue.status)}>
                          {getStatusLabel(queue.status)}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <QueueActions
                          status={queue.status}
                          processing={processingId === queue.id}
                          onUpdateStatus={(status) =>
                            void onUpdateStatus(queue.id, status)
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
