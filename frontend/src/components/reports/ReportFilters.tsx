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

import { FileText } from "lucide-react";

export default function ReportFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-5">
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
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
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
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="registrar">Registrar</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="admission">Admission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Report Type */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Report Type
            </label>

            <Select defaultValue="queue">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="queue">
                  Queue Report
                </SelectItem>

                <SelectItem value="analytics">
                  Analytics Report
                </SelectItem>

                <SelectItem value="forecast">
                  Forecast Report
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Status
            </label>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="processing">
                  Processing
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button */}

          <div className="flex items-end">
            <Button className="w-full gap-2">
              <FileText className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}