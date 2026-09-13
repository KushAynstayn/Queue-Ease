"use client";

import { PhoneCall } from "lucide-react";

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

type ServeNextDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ServeNextDialog({
  open,
  onOpenChange,
}: ServeNextDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Call Next Student?
          </AlertDialogTitle>

          <AlertDialogDescription>
            The next student in the queue will be assigned to
            your current service counter.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <PhoneCall className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Next Queue
              </p>

              <p className="font-semibold">
                EN-043 — Maria Santos
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction>
            Call Next
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}