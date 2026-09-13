"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const activities = [
  {
    queueNumber: "A-023",
    service: "Registrar",
    status: "Completed",
    time: "Yesterday",
  },
  {
    queueNumber: "B-017",
    service: "Cashier",
    status: "Completed",
    time: "Aug 7, 2026",
  },
  {
    queueNumber: "A-011",
    service: "Registrar",
    status: "Cancelled",
    time: "Aug 5, 2026",
  },
];

export default function RecentQueueActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            Recent Queue Activity
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Your latest queue transactions
          </p>
        </div>

        <Link
          href="/client/history"
          className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardHeader>

      <CardContent>
        <div className="divide-y">
          {activities.map((activity) => {
            const completed = activity.status === "Completed";

            return (
              <div
                key={`${activity.queueNumber}-${activity.time}`}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {activity.queueNumber}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {activity.service}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium">
                    {activity.status}
                  </p>

                  <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}