"use client";

import {
  AlertTriangle,
  SkipForward,
} from "lucide-react";

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

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SkipQueueDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SkipQueueDialog({
  open,
  onOpenChange,
}: SkipQueueDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Skip Queue Student?
          </AlertDialogTitle>

          <AlertDialogDescription>
            The selected queue transaction will be marked as
            skipped. Select a reason before continuing.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label>Reason</Label>

          <Select defaultValue="not-present">
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="not-present">
                Student not present
              </SelectItem>

              <SelectItem value="requested">
                Student requested to skip
              </SelectItem>

              <SelectItem value="service-unavailable">
                Service unavailable
              </SelectItem>

              <SelectItem value="other">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/30">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

          <p className="text-muted-foreground">
            Skipping a queue transaction will update its
            status and may affect the student&apos;s queue
            position.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction>
            <SkipForward className="mr-2 h-4 w-4" />
            Skip Student
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}