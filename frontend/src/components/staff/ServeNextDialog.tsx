
"use client";

import { PhoneCall } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processing: boolean;
  onConfirm: () => Promise<void>;
};

export function ServeNextDialog({
  open,
  onOpenChange,
  processing,
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Call Next Student?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Queue Ease will ask the server to assign the next eligible
            waiting student to your assigned open counter.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <PhoneCall className="h-5 w-5 text-primary" />
            </div>

            <p className="text-sm text-muted-foreground">
              The actual next queue number will be determined by the
              backend.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>
            Cancel
          </AlertDialogCancel>

          <Button
            disabled={processing}
            onClick={() => void onConfirm()}
          >
            {processing ? "Calling..." : "Confirm Call Next"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
