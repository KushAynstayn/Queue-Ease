"use client";

import {
  CheckCircle2,
  Clock3,
  History,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QueueHistoryItem {
  id: number;
  queueNumber: string;
  service: string;
  date: string;
  time: string;
  status: "Completed" | "Cancelled";
  waitTime: string;
}

const queueHistory: QueueHistoryItem[] = [
  {
    id: 1,
    queueNumber: "A-021",
    service: "Enrollment",
    date: "August 25, 2026",
    time: "10:15 AM",
    status: "Completed",
    waitTime: "18 minutes",
  },
  {
    id: 2,
    queueNumber: "A-015",
    service: "Enrollment Records",
    date: "August 22, 2026",
    time: "9:40 AM",
    status: "Completed",
    waitTime: "12 minutes",
  },
  {
    id: 3,
    queueNumber: "A-009",
    service: "Enrollment",
    date: "August 20, 2026",
    time: "8:55 AM",
    status: "Cancelled",
    waitTime: "—",
  },
];

function StatusIcon({
  status,
}: {
  status: QueueHistoryItem["status"];
}) {
  if (status === "Completed") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  }

  return <XCircle className="h-4 w-4 text-red-500" />;
}

export default function Page() {
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
          {queueHistory.length === 0 ? (
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
            <div className="divide-y">
              {queueHistory.map((queue) => (
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
                          {queue.queueNumber}
                        </h3>

                        <Badge
                          variant="secondary"
                          className={
                            queue.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {queue.status}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm">
                        {queue.service}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3 w-3" />

                        <span>
                          {queue.date} · {queue.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wait Time */}
                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground">
                      Waiting Time
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {queue.waitTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}