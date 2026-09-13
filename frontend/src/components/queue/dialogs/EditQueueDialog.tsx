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

interface EditQueueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const queueData = {
  queueNumber: "A023",
  clientName: "Juan Dela Cruz",
  service: "Registrar",
  counter: "Counter 2",
  priority: "Regular",
  mobile: "09123456789",
  status: "Waiting",
  sms: "Enable",
  remarks: "Priority verification completed.",
};

export default function EditQueueDialog({
  open,
  onOpenChange,
}: EditQueueDialogProps) {
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
            Edit Queue
          </DialogTitle>

          <DialogDescription>
            Update the queue information below.
          </DialogDescription>
        </DialogHeader>

        <QueueForm
          mode="edit"
          defaultValues={queueData}
        />

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button className="bg-[#2845D6] hover:bg-[#1f39bb]">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}