"use client";

import { Search } from "lucide-react";

import AddUserDialog from "./AddUserDialog";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFiltersProps {
  search: string;
  role: string;
  status: string;

  onSearchChange: (value: string) => void;
  onRoleChange: (value: string | null) => void;
  onStatusChange: (value: string | null) => void;

  onUserCreated: () => Promise<void> | void;
}

export default function UserFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onUserCreated,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }
          placeholder="Search users..."
          className="pl-10"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={role}
          onValueChange={onRoleChange}
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Roles
            </SelectItem>

            <SelectItem value="admin">
              Administrator
            </SelectItem>

            <SelectItem value="staff">
              Staff
            </SelectItem>

            <SelectItem value="client">
              Client
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Status
            </SelectItem>

            <SelectItem value="active">
              Active
            </SelectItem>

            <SelectItem value="inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>

        <AddUserDialog
          onUserCreated={onUserCreated}
        />
      </div>
    </div>
  );
}