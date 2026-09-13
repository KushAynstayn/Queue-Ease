"use client";

import {
  CheckCircle2,
  MoreHorizontal,
  RotateCcw,
  SkipForward,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QueueActions({
  status,
}: {
  status: string;
}) {
  const isWaiting = status === "Waiting";
  const isServing = status === "Serving";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Queue actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {isWaiting && (
          <DropdownMenuItem>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Serve Student
          </DropdownMenuItem>
        )}

        {isServing && (
          <>
            <DropdownMenuItem>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete
            </DropdownMenuItem>

            <DropdownMenuItem>
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </DropdownMenuItem>

            <DropdownMenuItem>
              <RotateCcw className="mr-2 h-4 w-4" />
              Recall
            </DropdownMenuItem>
          </>
        )}

        {!isServing && !isWaiting && (
          <DropdownMenuItem>
            <RotateCcw className="mr-2 h-4 w-4" />
            Recall
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}