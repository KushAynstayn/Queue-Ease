"use client";

import { useState } from "react";
import { PhoneCall, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { QueueFilters } from "@/components/staff/QueueFilters";
import { QueueTable } from "@/components/staff/QueueTable";
import { ServeNextDialog } from "@/components/staff/ServeNextDialog";

export default function StaffQueuePage() {
  const [serveNextOpen, setServeNextOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Queue Management
            </h1>

            <Badge variant="secondary">
              Counter 02
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage the current student queue.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button onClick={() => setServeNextOpen(true)}>
            <PhoneCall className="mr-2 h-4 w-4" />
            Call Next
          </Button>
        </div>
      </div>

      {/* Queue Filters */}
      <QueueFilters />

      {/* Queue Table */}
      <QueueTable />

      {/* Dialog */}
      <ServeNextDialog
        open={serveNextOpen}
        onOpenChange={setServeNextOpen}
      />
    </div>
  );
}