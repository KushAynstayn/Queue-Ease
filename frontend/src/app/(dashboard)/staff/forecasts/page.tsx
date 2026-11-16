
"use client";

import { useEffect, useState } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type {
  ApiResponse,
  ForecastResult,
  ForecastingData,
  PaginatedResponse,
} from "@/types/forecast";

import { ForecastChart } from "@/components/staff/ForecastChart";
import { ForecastOverview } from "@/components/staff/ForecastOverview";
import { PeakHoursCard } from "@/components/staff/PeakHoursCard";

export default function StaffForecastsPage() {
  const [forecasts, setForecasts] = useState<ForecastResult[]>([]);
  const [historicalData, setHistoricalData] = useState<ForecastingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadForecastData() {
      setLoading(true);
      setError(null);

      try {
        const [forecastResponse, historicalResponse] = await Promise.all([
          apiRequest<ApiResponse<PaginatedResponse<ForecastResult>>>(
            "/forecasts"
          ),
          apiRequest<ApiResponse<PaginatedResponse<ForecastingData>>>(
            "/forecasting-data"
          ),
        ]);

        if (cancelled) return;

        setForecasts(forecastResponse.data.data);
        setHistoricalData(historicalResponse.data.data);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof ApiRequestError
            ? err.message
            : "Unable to load forecast data. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadForecastData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Queue Forecasts
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review saved forecasts and historical queue demand to prepare for
          busy service periods.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <ForecastOverview
        forecasts={forecasts}
        loading={loading}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ForecastChart
            historicalData={historicalData}
            loading={loading}
          />
        </div>

        <PeakHoursCard
          historicalData={historicalData}
          loading={loading}
        />
      </div>
    </div>
  );
}
