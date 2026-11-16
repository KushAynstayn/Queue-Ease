
"use client";

import { Clock3, UsersRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type QueueItem = {
  id: number;
  queue_number: string;
  status: string;
  priority: "normal" | "priority";
  position_number: number | null;
  estimated_wait_minutes: number | null;
  student_number: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  service_name: string | null;
};

type Props = {
  queues: QueueItem[];
};

export function UpcomingQueue({ queues }: Props) {
  const waitingQueues = queues.filter(
    (queue) => queue.status === "waiting"
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Upcoming Queue</CardTitle>
            <CardDescription>
              Students waiting for service.
            </CardDescription>
          </div>
          <UsersRound className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        {waitingQueues.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="font-medium">No students waiting</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Waiting students will appear here when they join the queue.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {waitingQueues.map((item) => {
              const studentName = [
                item.first_name,
                item.middle_name,
                item.last_name,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                      {item.position_number ?? "—"}
                    </div>

                    <div>
                      <p className="font-medium">
                        {studentName || item.student_number || "Student details unavailable"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.queue_number}
                        {item.service_name ? ` · ${item.service_name}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {item.estimated_wait_minutes == null
                        ? "Wait unavailable"
                        : `${item.estimated_wait_minutes} min`}
                    </div>

                    {item.priority === "priority" && (
                      <Badge variant="outline">Priority</Badge>
                    )}

                    <Badge variant="secondary">Waiting</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
