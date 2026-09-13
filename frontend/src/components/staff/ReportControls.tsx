"use client";

import { Download, FileBarChart } from "lucide-react";
import { useState } from "react";

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

export function ReportControls() {
  const [reportType, setReportType] =
    useState("queue-performance");

  const [format, setFormat] = useState("pdf");

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
              Select a report type and file format.
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
                if (value) {
                  setReportType(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
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

            <Select
              value={format}
              onValueChange={(value) => {
                if (value) {
                  setFormat(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pdf">
                  PDF
                </SelectItem>

                <SelectItem value="csv">
                  CSV
                </SelectItem>

                <SelectItem value="xlsx">
                  XLSX
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}