"use client";

import { Button } from "@/components/ui/button";

export default function SaveSettings() {
  return (
    <div className="sticky bottom-0 z-10 flex flex-col gap-3 rounded-lg border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:flex-row sm:items-center sm:justify-end">
      <Button
        variant="outline"
        type="button"
      >
        Cancel
      </Button>

      <Button type="submit">
        Save Changes
      </Button>
    </div>
  );
}