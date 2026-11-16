
"use client";

import {
  CheckCircle2,
  MoreHorizontal,
  Play,
  SkipForward,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { QueueStatus } from "@/types/queue";

type Props = {
  status: QueueStatus;
  processing: boolean;
  onUpdateStatus: (
    status: "serving" | "completed" | "skipped"
  ) => void;
};

export function QueueActions({
  status,
  processing,
  onUpdateStatus,
}: Props) {
  // Only called and serving queues have actions here.
  if (status !== "called" && status !== "serving") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Queue actions"
        disabled={processing}
        className="inline-flex size-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {status === "called" && (
          <>
            <DropdownMenuItem
              disabled={processing}
              onClick={() => onUpdateStatus("serving")}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Serving
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={processing}
              onClick={() => onUpdateStatus("skipped")}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </DropdownMenuItem>
          </>
        )}

        {status === "serving" && (
          <>
            <DropdownMenuItem
              disabled={processing}
              onClick={() => onUpdateStatus("completed")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={processing}
              onClick={() => onUpdateStatus("skipped")}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
