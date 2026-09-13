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

export default function AnalyticsFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Date */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Date Range
            </label>

            <Select defaultValue="month">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="today">Today</SelectItem>

                <SelectItem value="week">
                  Last 7 Days
                </SelectItem>

                <SelectItem value="month">
                  Last 30 Days
                </SelectItem>

                <SelectItem value="year">
                  This Year
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Service
            </label>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Services
                </SelectItem>

                <SelectItem value="registrar">
                  Registrar
                </SelectItem>

                <SelectItem value="cashier">
                  Cashier
                </SelectItem>

                <SelectItem value="admission">
                  Admission
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Queue Status
            </label>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All
                </SelectItem>

                <SelectItem value="completed">
                  Completed
                </SelectItem>

                <SelectItem value="cancelled">
                  Cancelled
                </SelectItem>

                <SelectItem value="missed">
                  Missed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button */}

          <div className="flex items-end">
            <Button className="w-full gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}