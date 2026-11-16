
"use client";

import { Button } from "@/components/ui/button";

interface SaveSettingsProps {
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function SaveSettings({
  isSaving,
  onSave,
  onCancel,
}: SaveSettingsProps) {
  return (
    <div className="sticky bottom-0 z-10 flex flex-col gap-3 rounded-lg border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:flex-row sm:items-center sm:justify-end">
      <Button
        variant="outline"
        type="button"
        onClick={onCancel}
        disabled={isSaving}
      >
        Cancel
      </Button>

      <Button
        type="button"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
