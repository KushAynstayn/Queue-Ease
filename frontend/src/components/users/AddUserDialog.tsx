"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";

import UserForm from "./UserForm";

export default function AddUserDialog() {
  return (
    <Dialog>
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
          <DialogTitle>Add New User</DialogTitle>

          <DialogDescription>
            Create a new system account and assign a role.
          </DialogDescription>
        </DialogHeader>

        <UserForm />
      </DialogContent>
    </Dialog>
  );
}