
"use client";

import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";

import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import QueueTrendChart from "@/components/analytics/QueueTrendChart";
import ServiceDistribution from "@/components/analytics/ServiceDistribution";
import PerformanceMetrics from "@/components/analytics/PerformanceMetrics";

import {
  AnalyticsData,
  AnalyticsApiResponse,
} from "@/types/analytics";

function getDefaultDates() {
  const end = new Date();
  const start = new Date();

  start.setDate(start.getDate() - 29);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

export default function AnalyticsPage() {
  const defaultDates = getDefaultDates();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const [serviceId, setServiceId] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      if (serviceId !== "all") {
        params.set("service_id", serviceId);
      }

      const response = await apiRequest<AnalyticsApiResponse>(
        `/analytics?${params.toString()}`
      );

      if (!response.success) {
        throw new Error(response.message || "Unable to retrieve analytics.");
      }

      setAnalytics(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve analytics."
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, serviceId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Queue Analytics
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor queue performance and service efficiency.
        </p>
      </div>

      <AnalyticsFilters
        startDate={startDate}
        endDate={endDate}
        serviceId={serviceId}
        services={analytics?.service_performance ?? []}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onServiceChange={setServiceId}
        onApply={fetchAnalytics}
        loading={loading}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !analytics ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          Loading analytics...
        </div>
      ) : analytics ? (
        <>
          <AnalyticsSummary data={analytics.summary} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <QueueTrendChart data={analytics.queue_trend} />
            </div>

            <ServiceDistribution
              data={analytics.service_distribution}
            />
          </div>

          <PerformanceMetrics
            data={analytics.service_performance}
          />
        </>
      ) : !error ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          No analytics data available.
        </div>
      ) : null}
    </div>
  );
}
