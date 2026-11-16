
"use client";

import {
  CheckCircle2,
  Clock3,
  PhoneCall,
  SkipForward,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { QueueItem } from "@/types/queue";



type CurrentQueueItem = Omit<QueueItem, "status"> & {
  status: "called" | "serving";
};

type Props = {
  queue: CurrentQueueItem | null;
  processing: boolean;
  onUpdateStatus: (
    queueId: number,
    status: "serving" | "completed" | "skipped"
  ) => Promise<void>;
};

export function CurrentServing({
  queue,
  processing,
  onUpdateStatus,
}: Props) {
  const studentName = queue
    ? [
        queue.first_name,
        queue.middle_name,
        queue.last_name,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Currently Serving</CardTitle>
            <CardDescription>
              Manage the student assigned to your counter.
            </CardDescription>
          </div>

          {queue && (
            <Badge variant="default">
              {queue.status === "serving" ? "SERVING" : "CALLED"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {queue ? (
          <>
            <div className="rounded-xl border bg-muted/30 p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Queue Number
                  </p>
                  <p className="mt-1 text-4xl font-bold tracking-tight">
                    {queue.queue_number}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <UserRound className="h-7 w-7 text-primary" />
                </div>
              </div>

              <Separator className="my-5" />

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="mt-1 font-medium">
                    {studentName || queue.student_number || "Student details unavailable"}
                  </p>
                  {studentName && queue.student_number && (
                    <p className="text-xs text-muted-foreground">
                      {queue.student_number}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="mt-1 font-medium">
                    {queue.service_name || "Service unavailable"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Estimated Waiting Time
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 font-medium">
                    <Clock3 className="h-4 w-4 text-muted-foreground" />
                    {queue.estimated_wait_minutes == null
                      ? "Not available"
                      : `${queue.estimated_wait_minutes} min`}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {queue.status === "called" ? (
                <Button
                  disabled={processing}
                  onClick={() => onUpdateStatus(queue.id, "serving")}
                >
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Start Serving
                </Button>
              ) : (
                <Button
                  disabled={processing}
                  onClick={() => onUpdateStatus(queue.id, "completed")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete
                </Button>
              )}

              <Button
                variant="outline"
                disabled={processing}
                onClick={() => onUpdateStatus(queue.id, "skipped")}
              >
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <UserRound className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No active student</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Call the next student when an assigned counter is open.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
