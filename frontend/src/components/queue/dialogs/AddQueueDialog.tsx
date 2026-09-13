"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import QueueForm from "../QueueForm";

interface AddQueueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddQueueDialog({
  open,
  onOpenChange,
}: AddQueueDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          w-[95vw]
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New Queue
          </DialogTitle>

          <DialogDescription>
            Create a new queue ticket for a client.
            Fill in the required information below.
          </DialogDescription>
        </DialogHeader>

        <QueueForm mode="create" />

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button className="bg-[#2845D6] hover:bg-[#1f39bb]">
            Create Queue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}