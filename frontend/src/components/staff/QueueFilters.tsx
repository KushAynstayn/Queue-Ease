
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

import type { QueueFiltersValue, QueueService } from "@/types/queue";

type Props = {
  filters: QueueFiltersValue;
  services: QueueService[];
  onChange: (filters: QueueFiltersValue) => void;
};

export function QueueFilters({
  filters,
  services,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Search queue number or student number..."
          className="pl-9"
          aria-label="Search queue records"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={filters.status}
          onValueChange={(status) =>
            onChange({
              ...filters,
              status: status ?? "all",
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="called">Called</SelectItem>
            <SelectItem value="serving">Serving</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.serviceId}
          onValueChange={(serviceId) =>
            onChange({
              ...filters,
              serviceId: serviceId ?? "all-services",
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[190px]">
            <SelectValue placeholder="Filter by service" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all-services">
              All Services
            </SelectItem>

            {services.map((service) => (
              <SelectItem
                key={service.id}
                value={String(service.id)}
              >
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
