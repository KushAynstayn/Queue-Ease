"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

import type { ReportType } from "./types";

interface ReportFiltersProps {
  startDate: string;
  endDate: string;
  reportType: ReportType;
  loading: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onReportTypeChange: (value: ReportType) => void;
  onGenerate: () => void;
}

export default function ReportFilters({
  startDate,
  endDate,
  reportType,
  loading,
  onStartDateChange,
  onEndDateChange,
  onReportTypeChange,
  onGenerate,
}: ReportFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label
              htmlFor="report-start-date"
              className="text-sm font-medium"
            >
              Start Date
            </label>

            <input
              id="report-start-date"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) =>
                onStartDateChange(event.target.value)
              }
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="report-end-date"
              className="text-sm font-medium"
            >
              End Date
            </label>

            <input
              id="report-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) =>
                onEndDateChange(event.target.value)
              }
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="report-type"
              className="text-sm font-medium"
            >
              Report Type
            </label>

            <select
              id="report-type"
              value={reportType}
              onChange={(event) =>
                onReportTypeChange(
                  event.target.value as ReportType
                )
              }
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="queue">Queue Report</option>
              <option value="sms">SMS Report</option>
              <option value="forecast">Forecast Report</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            onClick={onGenerate}
            disabled={
              loading ||
              !startDate ||
              !endDate ||
              startDate > endDate
            }
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}