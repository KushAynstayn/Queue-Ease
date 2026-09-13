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

export default function ActiveQueueCard() {
  const hasActiveQueue = true;

  if (!hasActiveQueue) {
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

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Current Queue</CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Your active queue ticket
          </p>
        </div>

        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          Waiting
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
                A-024
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
                <p className="text-xs text-muted-foreground">
                  Service
                </p>

                <p className="text-sm font-medium">
                  Registrar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Estimated Wait
                </p>

                <p className="text-sm font-medium">
                  15 minutes
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