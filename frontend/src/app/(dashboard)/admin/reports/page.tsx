"use client";

import { useState } from "react";

import { AlertCircle } from "lucide-react";

import ReportFilters from "@/components/reports/ReportFilters";
import ReportPreview from "@/components/reports/ReportPreview";
import ExportActions from "@/components/reports/ExportActions";

import {
  apiRequest,
  ApiRequestError,
} from "@/lib/api";

import type {
  ReportApiResponse,
  ReportData,
  ReportType,
  QueueReportData,
  SmsReportData,
  ForecastReportData,
} from "@/components/reports/types";

function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultDates() {
  const end = new Date();
  const start = new Date();

  start.setDate(start.getDate() - 29);

  return {
    start: getDateString(start),
    end: getDateString(end),
  };
}

export default function ReportsPage() {
  const [defaultDates] = useState(getDefaultDates);

  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);

  const [reportType, setReportType] = useState<ReportType>("queue");

  const [reportData, setReportData] = useState<ReportData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  function handleStartDateChange(value: string) {
    setStartDate(value);
    setReportData(null);
    setGenerated(false);
    setError("");
  }

  function handleEndDateChange(value: string) {
    setEndDate(value);
    setReportData(null);
    setGenerated(false);
    setError("");
  }

  function handleReportTypeChange(value: ReportType) {
    setReportType(value);
    setReportData(null);
    setGenerated(false);
    setError("");
  }

  async function handleGenerate() {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (startDate > endDate) {
      setError("End date must be after or equal to start date.");
      return;
    }

    setLoading(true);
    setError("");
    setReportData(null);
    setGenerated(false);

    try {
      const params = new URLSearchParams({
        from: startDate,
        to: endDate,
      });

      const endpoint = `/reports/${reportType}?${params.toString()}`;

      if (reportType === "queue") {
        const response = await apiRequest<
          ReportApiResponse<QueueReportData>
        >(endpoint);

        setReportData(response.data);
      } else if (reportType === "sms") {
        const response = await apiRequest<
          ReportApiResponse<SmsReportData>
        >(endpoint);

        setReportData(response.data);
      } else {
        const response = await apiRequest<
          ReportApiResponse<ForecastReportData>
        >(endpoint);

        setReportData(response.data);
      }

      setGenerated(true);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while generating the report.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports
        </h1>

        <p className="mt-2 text-muted-foreground">
          Generate and export queue performance, SMS, and forecasting reports.
        </p>
      </div>

      <ReportFilters
        startDate={startDate}
        endDate={endDate}
        reportType={reportType}
        loading={loading}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onReportTypeChange={handleReportTypeChange}
        onGenerate={handleGenerate}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {generated && reportData && (
        <>
          <ReportPreview
            data={reportData}
            reportType={reportType}
            startDate={startDate}
            endDate={endDate}
          />

          <ExportActions
            reportType={reportType}
            startDate={startDate}
            endDate={endDate}
            disabled={!generated}
          />
        </>
      )}
    </div>
  );
}