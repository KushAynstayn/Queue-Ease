"use client";

import { Info } from "lucide-react";

interface QueuePositionProps {
  position: number;
  totalWaiting: number;
}

export default function QueuePosition({
  position,
  totalWaiting,
}: QueuePositionProps) {
  const progress =
    totalWaiting > 0
      ? Math.max(
          0,
          Math.min(100, ((totalWaiting - position + 1) / totalWaiting) * 100)
        )
      : 0;

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">
            Queue Progress
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Your position updates as students are served.
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Position {position}
          </span>

          <span className="font-medium">
            {totalWaiting} waiting
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[#2845D6] transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Please remain available while waiting for your queue number to be
        called.
      </p>
    </div>
  );
}