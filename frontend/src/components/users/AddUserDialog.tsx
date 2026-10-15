"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UserForm from "./UserForm";

import {
  createUser,
  type CreateUserPayload,
} from "@/services/users/user.service";

interface AddUserDialogProps {
  onUserCreated: () => Promise<void> | void;
}

export default function AddUserDialog({
  onUserCreated,
}: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    payload: CreateUserPayload
  ) => {
    setIsLoading(true);

    try {
      await createUser(payload);
      await onUserCreated();
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        }
      />

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Add New User
          </DialogTitle>

          <DialogDescription>
            Create a new system account and assign a role.
          </DialogDescription>
        </DialogHeader>

        <UserForm
          mode="create"
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}