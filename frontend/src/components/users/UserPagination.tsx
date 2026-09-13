"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UserPagination() {
  return (
    <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">1–5</span> of{" "}
        <span className="font-medium">154</span> users
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="sm"
        >
          1
        </Button>

        <Button
          variant="outline"
          size="sm"
        >
          2
        </Button>

        <Button
          variant="outline"
          size="sm"
        >
          3
        </Button>

        <Button
          variant="outline"
          size="icon"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}