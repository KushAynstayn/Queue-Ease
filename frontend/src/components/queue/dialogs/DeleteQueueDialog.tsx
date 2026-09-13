"use client";

import {
  AlertTriangle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface DeleteQueueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteQueueDialog({
  open,
  onOpenChange,
}: DeleteQueueDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle
              size={30}
              className="text-red-600"
            />
          </div>

          <DialogTitle className="text-center text-2xl">
            Delete Queue
          </DialogTitle>

          <DialogDescription className="text-center">
            Are you sure you want to delete this queue?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
          >
            Delete Queue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}