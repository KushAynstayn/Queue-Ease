"use client";

import { CheckCircle2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type CompleteQueueDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CompleteQueueDialog({
  open,
  onOpenChange,
}: CompleteQueueDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Complete Queue Transaction?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Confirm that the current student&apos;s service has
            been completed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="font-semibold">
                EN-042 — Juan Dela Cruz
              </p>

              <p className="text-sm text-muted-foreground">
                Enrollment
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}