
"use client";

import { useState } from "react";
import { Download, FileBarChart } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { downloadApiFile, ApiRequestError } from "@/lib/api";

type ReportType = "queue-performance" | "sms-log" | "forecast-summary";

const reportTypeMap: Record<ReportType, string> = {
  "queue-performance": "queue",
  "sms-log": "sms",
  "forecast-summary": "forecast",
};

function getToday(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function ReportControls() {
  const [reportType, setReportType] =
    useState<ReportType>("queue-performance");

  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateReport = async () => {
    setIsExporting(true);
    setError("");

    try {
      const backendType = reportTypeMap[reportType];
      const date = getToday();

      const endpoint =
        `/staff/reports/pdf?type=${backendType}&date=${date}`;

      const filename = `staff-${backendType}-report-${date}.pdf`;

      await downloadApiFile(endpoint, filename);
    } catch (err) {
      setError(
        err instanceof ApiRequestError || err instanceof Error
          ? err.message
          : "Unable to generate the report."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileBarChart className="h-5 w-5 text-primary" />
          </div>

          <div>
            <CardTitle>Generate Report</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Select a report type and download it as a PDF.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Report Type</Label>

            <Select
              value={reportType}
              onValueChange={(value) => {
                setReportType(value as ReportType);
                setError("");
              }}
              disabled={isExporting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="queue-performance">
                  Queue Performance
                </SelectItem>

                <SelectItem value="sms-log">
                  SMS Delivery Log
                </SelectItem>

                <SelectItem value="forecast-summary">
                  Forecast Summary
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Format</Label>

            <Select value="pdf" disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              className="w-full"
              onClick={handleGenerateReport}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Reports are generated using today's records from your assigned services and counters.
        </p>
      </CardContent>
    </Card>
  );
}
