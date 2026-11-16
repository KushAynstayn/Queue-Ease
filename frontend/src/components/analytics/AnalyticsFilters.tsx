
"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Filter } from "lucide-react";

import { ServicePerformanceData } from "@/types/analytics";

interface AnalyticsFiltersProps {
  startDate: string;
  endDate: string;
  serviceId: string;
  services: ServicePerformanceData[];
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onApply: () => void;
  loading: boolean;
}

export default function AnalyticsFilters({
  startDate,
  endDate,
  serviceId,
  services,
  onStartDateChange,
  onEndDateChange,
  onServiceChange,
  onApply,
  loading,
}: AnalyticsFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(event) =>
                onStartDateChange(event.target.value)
              }
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) =>
                onEndDateChange(event.target.value)
              }
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Service
            </label>

            <Select
              value={serviceId}
              onValueChange={(value) => onServiceChange(value ?? "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Services" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Services
                </SelectItem>

                {services.map((service) => (
                  <SelectItem
                    key={service.service_id}
                    value={String(service.service_id)}
                  >
                    {service.service_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            onClick={onApply}
            disabled={loading || !startDate || !endDate}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />

            {loading ? "Loading..." : "Apply Filters"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
