"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { AdminUser } from "@/services/users/user.service";

interface UserDetailsDialogProps {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            User Details
          </DialogTitle>

          <DialogDescription>
            Account information for{" "}
            {user.first_name} {user.last_name}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              First Name
            </p>
            <p className="font-medium">
              {user.first_name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Middle Name
            </p>
            <p className="font-medium">
              {user.middle_name || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Last Name
            </p>
            <p className="font-medium">
              {user.last_name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Username
            </p>
            <p className="font-medium">
              {user.username}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Email
            </p>
            <p className="font-medium">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Phone
            </p>
            <p className="font-medium">
              {user.phone || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Role
            </p>
            <p className="font-medium">
              {user.role?.name || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Status
            </p>
            <p className="font-medium capitalize">
              {user.status}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Created
            </p>
            <p className="font-medium">
              {new Date(
                user.created_at
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Last Login
            </p>
            <p className="font-medium">
              {user.last_login_at
                ? new Date(
                    user.last_login_at
                  ).toLocaleString()
                : "Never"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}