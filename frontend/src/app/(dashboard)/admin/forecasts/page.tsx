
"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api";
import ForecastFilters, {
  type ForecastService,
  type ForecastTarget,
} from "@/components/forecast/ForecastFilters";
import ForecastSummary, {
  type ForecastResult,
} from "@/components/forecast/ForecastSummary";
import PredictionTable from "@/components/forecast/PredictionTable";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ForecastGenerationResponse {
  status: "success" | "error";
  message: string;
  data?: ForecastResult;
  target?: ForecastTarget;
  production_ready?: boolean;
  warning?: string;
  observation_count?: number;
  minimum_observations?: number;
}

function getTomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    const validationMessages = error.errors
      ? Object.values(error.errors).flat().join(" ")
      : "";

    return validationMessages || error.message;
  }

  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

export default function ForecastPage() {
  const [services, setServices] = useState<ForecastService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [forecastDate, setForecastDate] = useState(getTomorrow);
  const [target, setTarget] = useState<ForecastTarget>("total_transactions");
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setError("");

    try {
      const response = await apiRequest<ApiEnvelope<ForecastService[]>>(
        "/services"
      );

      const activeServices = Array.isArray(response.data)
        ? response.data.filter((service) => service.status === "active")
        : [];

      setServices(activeServices);

      setSelectedServiceId((current) => {
        if (activeServices.some((service) => String(service.id) === current)) {
          return current;
        }

        return activeServices.length > 0
          ? String(activeServices[0].id)
          : "";
      });
    } catch (err) {
      setError(`Could not load services: ${getErrorMessage(err)}`);
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  async function generateForecast() {
    if (!selectedServiceId || !forecastDate) {
      setError("Select a service and forecast date first.");
      return;
    }

    if (forecastDate < getTomorrow()) {
      setError("Choose a future date for the forecast.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    setForecast(null);

    try {
      const response = await apiRequest<ForecastGenerationResponse>(
        "/forecasts",
        {
          method: "POST",
          body: JSON.stringify({
            service_id: Number(selectedServiceId),
            forecast_date: forecastDate,
            target,
          }),
        }
      );

      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || "Forecast generation failed.");
      }

      setForecast(response.data);
      setNotice(
        response.warning ||
          "Experimental forecast generated. Operational accuracy has not been established."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Forecasting</h1>
        <p className="text-muted-foreground">
          Generate experimental daily predictions for queue transactions or
          average waiting time using historical queue data.
        </p>
      </div>

      <ForecastFilters
        services={services}
        servicesLoading={servicesLoading}
        selectedServiceId={selectedServiceId}
        forecastDate={forecastDate}
        target={target}
        loading={loading}
        onServiceChange={(value) => {
          setSelectedServiceId(value);
          setForecast(null);
          setNotice("");
        }}
        onDateChange={(value) => {
          setForecastDate(value);
          setForecast(null);
          setNotice("");
        }}
        onTargetChange={(value) => {
          setTarget(value);
          setForecast(null);
          setNotice("");
        }}
        onGenerate={generateForecast}
      />

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="font-semibold">Unable to complete the request</p>
          <p className="mt-1">{error}</p>

          {error.toLowerCase().includes("service") && (
            <button
              type="button"
              onClick={() => void loadServices()}
              className="mt-2 underline"
            >
              Retry loading services
            </button>
          )}
        </div>
      )}

      {notice && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Experimental result</p>
          <p className="mt-1">{notice}</p>
          <p className="mt-1">
            This prediction is not production-ready. Accuracy on genuine
            operational data has not been established.
          </p>
        </div>
      )}

      <ForecastSummary forecast={forecast} target={target} />

      <PredictionTable forecast={forecast} target={target} />

      <div className="rounded-xl border bg-muted/30 p-5">
        <h2 className="font-semibold">Forecasting limitations</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The current API generates one prediction for a selected future date.
          Hourly demand charts, peak-hour predictions, confidence scores, RMSE,
          and MAE are not displayed here because the current generation
          endpoint does not provide those results.
        </p>
      </div>
    </div>
  );
}
