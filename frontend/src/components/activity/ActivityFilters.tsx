"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ActivityFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <div className="relative w-full lg:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search activities..."
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* User Filter */}
        <Select defaultValue="all-users">
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="User" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all-users">
              All Users
            </SelectItem>

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

        {/* Action Filter */}
        <Select defaultValue="all-actions">
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all-actions">
              All Actions
            </SelectItem>

            <SelectItem value="login">
              Login
            </SelectItem>

            <SelectItem value="logout">
              Logout
            </SelectItem>

            <SelectItem value="create">
              Create
            </SelectItem>

            <SelectItem value="update">
              Update
            </SelectItem>

            <SelectItem value="delete">
              Delete
            </SelectItem>

            <SelectItem value="sms">
              SMS Sent
            </SelectItem>

            <SelectItem value="forecast">
              Forecast Generated
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select defaultValue="today">
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="today">
              Today
            </SelectItem>

            <SelectItem value="week">
              This Week
            </SelectItem>

            <SelectItem value="month">
              This Month
            </SelectItem>

            <SelectItem value="all-time">
              All Time
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}