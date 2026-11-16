
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BellRing,
  RefreshCw,
  TicketCheck,
  Megaphone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { apiRequest } from "@/lib/api";

import { SmsStatusCard } from "@/components/staff/SmsStatusCard";
import { SmsLogs } from "@/components/staff/SmsLogs";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export interface SmsSummary {
  sent_today: number;
  pending: number;
  failed: number;
}

export interface SmsLog {
  id: number;
  queue_transaction_id: number;
  recipient_number: string;
  message_type: string;
  message: string;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  error_message: string | null;
  created_at: string;
  queue_number: string;
  service_name: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
}

interface PaginatedLogs {
  data: SmsLog[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function StaffSmsPage() {
  const [summary, setSummary] = useState<SmsSummary>({
    sent_today: 0,
    pending: 0,
    failed: 0,
  });

  const [logs, setLogs] = useState<SmsLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const [summaryResponse, logsResponse] = await Promise.all([
        apiRequest<ApiResponse<SmsSummary>>(
          "/staff/sms/summary"
        ),

        apiRequest<ApiResponse<PaginatedLogs>>(
          "/staff/sms/notifications?per_page=15"
        ),
      ]);

      setSummary(summaryResponse.data);
      setLogs(logsResponse.data.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load SMS notification data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="h-6 w-6 text-primary" />

            <h1 className="text-2xl font-semibold tracking-tight">
              SMS Notifications
            </h1>

            <Badge variant="secondary">Staff</Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor automated SMS notifications triggered by queue activities.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => loadData(false)}
          disabled={refreshing || loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* SMS Status and Automatic Triggers */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Automatic SMS Triggers</CardTitle>

              <p className="text-sm text-muted-foreground">
                Queue Ease automatically prepares SMS notifications when
                these queue events occur.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Queue Confirmation */}
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <TicketCheck className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">
                    Queue Confirmation
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Triggered when a student successfully joins an
                    enrollment queue.
                  </p>
                </div>

                <Badge variant="outline">Automatic</Badge>
              </div>

              {/* Now Serving */}
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Megaphone className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">
                    Now Serving
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Triggered when staff calls the next student
                    in the queue.
                  </p>
                </div>

                <Badge variant="outline">Automatic</Badge>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                SMS processing depends on the administrator&apos;s notification settings and the student&apos;s notification preference. Failed submissions are recorded for monitoring.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SMS Status */}
        <div>
          <SmsStatusCard
            summary={summary}
            loading={loading}
          />
        </div>
      </div>

      {/* SMS Logs */}
      <SmsLogs
        logs={logs}
        loading={loading}
      />
    </div>
  );
}
