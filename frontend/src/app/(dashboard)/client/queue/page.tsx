"use client";

import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

import QueueHeader from "@/components/client/queue/QueueHeader";
import QueueStatusCard from "@/components/client/queue/QueueStatusCard";
import QueuePosition from "@/components/client/queue/QueuePosition";
import QueueStatusInfo from "@/components/client/queue/QueueStatusInfo";

export default function Page() {
  /*
   * Temporary frontend state.
   *
   * Phase 7:
   * This will come from the Laravel API.
   */
  const hasActiveQueue = true;

  if (!hasActiveQueue) {
    return (
      <div className="space-y-6">
        <QueueHeader />

        <div className="rounded-xl border border-dashed p-8 text-center">
          <h2 className="text-lg font-semibold">
            You are not currently in a queue
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Join an enrollment queue to receive a queue number and monitor
            your estimated waiting time.
          </p>

          <Link
            href="/client/queue"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#2845D6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2845D6]/90"
          >
            Join Queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <QueueHeader />

        <Link
          href="/client"
          className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {/* Main Queue Status */}
      <QueueStatusCard
        queueNumber="A-024"
        serviceName="Enrollment"
        status="Waiting"
        position={5}
        estimatedWait="15 minutes"
        currentServing="A-019"
      />

      {/* Queue Progress */}
      <QueuePosition
        position={5}
        totalWaiting={12}
      />

      {/* Information */}
      <QueueStatusInfo />

      {/* Leave Queue */}
      <div className="flex justify-end border-t pt-6">
        <Button
          type="button"
          variant="outline"
          className="text-destructive hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Leave Queue
        </Button>
      </div>
    </div>
  );
}