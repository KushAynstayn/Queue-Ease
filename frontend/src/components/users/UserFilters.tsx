"use client";

import { Search } from "lucide-react";

import AddUserDialog from "./AddUserDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <div className="relative w-full lg:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search users..."
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="administrator">
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

        <Select defaultValue="active">
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">
              Active
            </SelectItem>
            <SelectItem value="inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>

        <Button className="gap-2">
          <AddUserDialog />
        </Button>
      </div>
    </div>
  );
}