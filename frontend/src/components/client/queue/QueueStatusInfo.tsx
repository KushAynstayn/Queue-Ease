"use client";

import {
  BellRing,
  Clock3,
  MessageSquareText,
} from "lucide-react";

export default function QueueStatusInfo() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2845D6]/10">
          <Clock3 className="h-4 w-4 text-[#2845D6]" />
        </div>

        <h3 className="mt-3 text-sm font-semibold">
          Monitor your queue
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Your queue position and estimated waiting time may change as the
          queue moves.
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2845D6]/10">
          <BellRing className="h-4 w-4 text-[#2845D6]" />
        </div>

        <h3 className="mt-3 text-sm font-semibold">
          Stay available
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Keep checking your queue status while waiting for your turn.
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2845D6]/10">
          <MessageSquareText className="h-4 w-4 text-[#2845D6]" />
        </div>

        <h3 className="mt-3 text-sm font-semibold">
          SMS updates
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Queue updates can also be sent to your registered mobile number.
        </p>
      </div>
    </div>
  );
}