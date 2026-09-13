"use client";

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

interface UserActionsProps {
  status: string;
}

export default function UserActions({
  status,
}: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
            <Button
            variant="ghost"
            size="icon"
            >
            <MoreHorizontal className="h-4 w-4" />
            </Button>
        }
        />

      <DropdownMenuContent
        align="end"
        className="w-52"
      >
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>

        <DropdownMenuItem>
          <KeyRound className="mr-2 h-4 w-4" />
          Reset Password
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <UserX className="mr-2 h-4 w-4" />
          {status === "Active"
            ? "Deactivate User"
            : "Activate User"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}