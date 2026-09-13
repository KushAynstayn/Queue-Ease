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

type RecallQueueDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RecallQueueDialog({
  open,
  onOpenChange,
}: RecallQueueDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Recall Student?
          </AlertDialogTitle>

          <AlertDialogDescription>
            The selected student will be called again at the
            current service counter.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            Queue Number
          </p>

          <p className="mt-1 text-2xl font-bold">
            EN-042
          </p>

          <p className="mt-1 text-sm">
            Juan Dela Cruz
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction>
            <PhoneCall className="mr-2 h-4 w-4" />
            Recall Student
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}