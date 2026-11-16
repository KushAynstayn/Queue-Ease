"use client";

import { useState } from "react";

import {
  Download,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { downloadApiFile } from "@/lib/api";

import type { ReportType } from "./types";

interface ExportActionsProps {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  disabled: boolean;
}

export default function ExportActions({
  reportType,
  startDate,
  endDate,
  disabled,
}: ExportActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setDownloading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        type: reportType,
        from: startDate,
        to: endDate,
      });

      await downloadApiFile(
        `/reports/pdf?${params.toString()}`,
        `${reportType}-report.pdf`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to download the PDF report."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Report</CardTitle>

        <CardDescription>
          Download the generated report as a PDF document.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          onClick={handleDownload}
          disabled={disabled || downloading}
          className="w-full gap-2 sm:w-auto"
        >
          {downloading ? (
            <>
              <Download className="h-4 w-4 animate-pulse" />
              Downloading...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Export PDF
            </>
          )}
        </Button>

        {error && (
          <p className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}