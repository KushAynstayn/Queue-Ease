
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export interface ForecastService {
  id: number;
  name: string;
  code: string;
  estimated_service_minutes: number;
  status: "active" | "inactive";
}

export type ForecastTarget =
  | "total_transactions"
  | "average_wait_minutes";

interface ForecastFiltersProps {
  services: ForecastService[];
  servicesLoading: boolean;
  selectedServiceId: string;
  forecastDate: string;
  target: ForecastTarget;
  loading: boolean;
  onServiceChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTargetChange: (value: ForecastTarget) => void;
  onGenerate: () => void;
}

function getTomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ForecastFilters({
  services,
  servicesLoading,
  selectedServiceId,
  forecastDate,
  target,
  loading,
  onServiceChange,
  onDateChange,
  onTargetChange,
  onGenerate,
}: ForecastFiltersProps) {
  const minimumDate = getTomorrow();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label
              htmlFor="forecast-date"
              className="text-sm font-medium"
            >
              Forecast Date
            </label>

            <input
              id="forecast-date"
              type="date"
              min={minimumDate}
              value={forecastDate}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="forecast-service"
              className="text-sm font-medium"
            >
              Service
            </label>

            <select
              id="forecast-service"
              value={selectedServiceId}
              onChange={(event) => onServiceChange(event.target.value)}
              disabled={servicesLoading || services.length === 0}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">
                {servicesLoading
                  ? "Loading services..."
                  : services.length === 0
                    ? "No active services"
                    : "Select a service"}
              </option>

              {services.map((service) => (
                <option key={service.id} value={String(service.id)}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="forecast-target"
              className="text-sm font-medium"
            >
              Prediction Target
            </label>

            <select
              id="forecast-target"
              value={target}
              onChange={(event) =>
                onTargetChange(event.target.value as ForecastTarget)
              }
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="total_transactions">
                Total Transactions
              </option>
              <option value="average_wait_minutes">
                Average Wait (Minutes)
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              onClick={onGenerate}
              disabled={
                loading ||
                servicesLoading ||
                !selectedServiceId ||
                !forecastDate ||
                forecastDate < minimumDate
              }
              className="w-full gap-2"
            >
              <BrainCircuit className="h-4 w-4" />
              {loading ? "Generating..." : "Generate Forecast"}
            </Button>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Forecasts are experimental and require at least 10 historical
          daily observations for the selected service.
        </p>
      </CardContent>
    </Card>
  );
}
