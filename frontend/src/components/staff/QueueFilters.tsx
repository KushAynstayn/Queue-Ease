"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function QueueFilters() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search queue number or student..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[160px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="serving">Serving</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-services">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Service" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all-services">All Services</SelectItem>
            <SelectItem value="enrollment">Enrollment</SelectItem>
            <SelectItem value="registration">Registration</SelectItem>
            <SelectItem value="documents">
              Document Request
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}