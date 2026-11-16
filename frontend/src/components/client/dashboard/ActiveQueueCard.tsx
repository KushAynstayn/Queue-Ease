
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Hash,
  MapPin,
  TicketCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QueueTransaction {
  id: number;
  queue_number: string;
  queue_date: string;
  status: string;
  estimated_wait_minutes: number | null;
  requested_at: string | null;
  completed_at: string | null;
  service?: {
    id: number;
    name: string;
    code: string;
  } | null;
}

interface ActiveQueueCardProps {
  queue: QueueTransaction | null;
  loading: boolean;
}

const statusLabels: Record<string, string> = {
  waiting: "Waiting",
  called: "Called",
  serving: "Serving",
};

export default function ActiveQueueCard({
  queue,
  loading,
}: ActiveQueueCardProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Current Queue</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
          Loading your active queue...
        </CardContent>
      </Card>
    );
  }

  if (!queue) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Current Queue</CardTitle>
        </CardHeader>

        <CardContent className="flex min-h-[220px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <TicketCheck className="h-6 w-6 text-muted-foreground" />
          </div>

          <h3 className="font-semibold">No active queue</h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            You are not currently in a queue. Join a queue when you need a
            school service.
          </p>

          <Link
            href="/client/queue"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#2845D6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2845D6]/90"
          >
            Join Queue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  const statusLabel = statusLabels[queue.status] ?? queue.status;
  const isWaiting = queue.status === "waiting";

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Current Queue</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Your active queue ticket
          </p>
        </div>

        <Badge
          variant="secondary"
          className={
            isWaiting
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              : ""
          }
        >
          {statusLabel}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border bg-muted/30 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Queue Number
              </p>
              <p className="mt-1 text-4xl font-bold tracking-tight">
                {queue.queue_number}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2845D6]/10">
              <Hash className="h-6 w-6 text-[#2845D6]" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="text-sm font-medium">
                  {queue.service?.name ?? "Service unavailable"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Estimated Wait</p>
                <p className="text-sm font-medium">
                  {queue.estimated_wait_minutes != null
                    ? `${queue.estimated_wait_minutes} minutes`
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/client/queue"
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          View Queue Status
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
