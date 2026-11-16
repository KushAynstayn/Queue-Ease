
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ReportSummary } from "@/components/staff/ReportSummary";
import { QueueVolumeChart } from "@/components/staff/QueueVolumeChart";
import { ReportControls } from "@/components/staff/ReportControls";
import { ApiRequestError, apiRequest } from "@/lib/api";

interface HourlyVolume {
  hour: number;
  time: string;
  clients: number;
}

interface StaffReportSummaryData {
  total_clients_served: number;
  average_wait_minutes: number;
  peak_hour: string | null;
  sms_sent: number;
  hourly_volume: HourlyVolume[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function getToday(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function StaffReportsPage() {
  const [report, setReport] = useState<StaffReportSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const date = getToday();

      const response = await apiRequest<ApiResponse<StaffReportSummaryData>>(
        `/staff/reports/summary?date=${date}`
      );

      if (!response.success) {
        throw new Error(response.message || "Unable to retrieve report data.");
      }

      setReport(response.data);
    } catch (err) {
      setError(
        err instanceof ApiRequestError || err instanceof Error
          ? err.message
          : "Unable to load staff reports."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Queue Performance Reports
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Review queue performance and service activity for today.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={loadReport}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Unable to load reports
          </p>

          <p className="mt-1 text-sm text-muted-foreground">{error}</p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={loadReport}
          >
            Try Again
          </Button>
        </div>
      )}

      <ReportSummary
        totalClientsServed={report?.total_clients_served ?? 0}
        averageWaitMinutes={report?.average_wait_minutes ?? 0}
        peakHour={report?.peak_hour ?? null}
        smsSent={report?.sms_sent ?? 0}
        loading={loading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Queue Volume by Hour</CardTitle>

          <CardDescription>
            Number of clients completed during each service hour today.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <QueueVolumeChart
            data={report?.hourly_volume ?? []}
            loading={loading}
          />
        </CardContent>
      </Card>

      <ReportControls />
    </div>
  );
}
