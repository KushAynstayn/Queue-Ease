"use client";

import { useState } from "react";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  KeyRound,
  UserX,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UserForm from "./UserForm";

import {
  deleteUser,
  resetUserPassword,
  updateUser,
  updateUserStatus,
  type AdminUser,
  type UpdateUserPayload,
} from "@/services/users/user.service";

import UserDetailsDialog from "./UserDetailsDialog";

interface UserActionsProps {
  user: AdminUser;
  onUserChanged: () => Promise<void> | void;
}

export default function UserActions({
  user,
  onUserChanged,
}: UserActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async (
    payload: UpdateUserPayload
  ) => {
    setIsLoading(true);

    try {
      await updateUser(user.id, payload);
      await onUserChanged();
      setEditOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus =
      user.status === "active"
        ? "inactive"
        : "active";

    setIsLoading(true);

    try {
      await updateUserStatus(user.id, {
        status: nextStatus,
      });

      await onUserChanged();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const password = window.prompt(
      "Enter the new password:"
    );

    if (!password) {
      return;
    }

    const confirmation = window.prompt(
      "Confirm the new password:"
    );

    if (password !== confirmation) {
      window.alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetUserPassword(user.id, {
        password,
        password_confirmation: confirmation,
      });

      window.alert(
        "Password reset successfully."
      );

      setPasswordOpen(false);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to reset password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.first_name} ${user.last_name}?`
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);

    try {
      await deleteUser(user.id);
      await onUserChanged();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />

        <DropdownMenuContent
          align="end"
          className="w-52"
        >
          <DropdownMenuItem
            onClick={() => setViewOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setPasswordOpen(true)}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Reset Password
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleToggleStatus}
          >
            <UserX className="mr-2 h-4 w-4" />

            {user.status === "active"
              ? "Deactivate User"
              : "Activate User"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDetailsDialog
        user={user}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit User
            </DialogTitle>

            <DialogDescription>
              Update the user's account information and role.
            </DialogDescription>
          </DialogHeader>

          <UserForm
            mode="edit"
            user={user}
            isLoading={isLoading}
            onSubmit={handleEdit}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reset Password
            </DialogTitle>

            <DialogDescription>
              Reset the password for{" "}
              {user.first_name} {user.last_name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will open a secure password prompt.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setPasswordOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading
                  ? "Resetting..."
                  : "Reset Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}