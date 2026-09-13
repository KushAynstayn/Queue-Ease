"use client";

import { Ticket } from "lucide-react";

export default function QueueHeader() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Ticket className="h-5 w-5 text-[#2845D6]" />

        <span className="text-sm font-medium text-muted-foreground">
          My Queue
        </span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        Join a Queue
      </h1>

      <p className="text-sm text-muted-foreground">
        Select the enrollment service you need and request a queue number.
      </p>
    </div>
  );
}