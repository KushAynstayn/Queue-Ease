"use client";

import {
  BrainCircuit,
  Users,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Clock3,
  ArrowRight,
} from "lucide-react";

import type { AdminDashboardData } from "@/services/admin/dashboard.service";

interface DashboardCardsProps {
  queue: AdminDashboardData["queue"];
  sms: AdminDashboardData["sms"];
  latestForecast: AdminDashboardData["latest_forecast"];
}

interface ForecastData {
  predicted_transactions?: number;
  predicted_wait_minutes?: number;
  predicted_peak_hour?: number;
  model_name?: string;
  confidence_score?: number;
  forecast_date?: string;
}

export default function DashboardCards({
  queue,
  sms,
  latestForecast,
}: DashboardCardsProps) {
  const forecast = latestForecast as ForecastData | null;

  const peakHour =
    typeof forecast?.predicted_peak_hour === "number"
      ? `${forecast.predicted_peak_hour
          .toString()
          .padStart(2, "0")}:00`
      : "N/A";

  const confidence =
    typeof forecast?.confidence_score === "number"
      ? `${forecast.confidence_score.toFixed(1)}%`
      : "N/A";

  const deliveryTotal = sms.delivered + sms.failed;

  const deliverySuccess =
    deliveryTotal > 0
      ? `${((sms.delivered / deliveryTotal) * 100).toFixed(1)}%`
      : "N/A";

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      {/* AI Forecast */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#2845D6]/10 p-3">
            <BrainCircuit
              className="text-[#2845D6]"
              size={24}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              AI Forecast Summary
            </h2>

            <p className="text-sm text-slate-500">
              Latest prediction
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Expected Clients
            </span>

            <span className="font-bold text-slate-800">
              {forecast?.predicted_transactions ?? "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Predicted Peak Hour
            </span>

            <span className="font-bold text-slate-800">
              {peakHour}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Confidence
            </span>

            <span className="font-bold text-emerald-600">
              {confidence}
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-blue-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            Forecast details will be expanded in the Admin
            Forecasting module.
          </p>
        </div>
      </div>

      {/* Queue Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-3">
            <Users
              className="text-amber-600"
              size={24}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Queue Summary
            </h2>

            <p className="text-sm text-slate-500">
              Current operations
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3
                size={18}
                className="text-slate-400"
              />

              <span className="text-slate-500">
                Waiting Clients
              </span>
            </div>

            <span className="font-semibold">
              {queue.waiting}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Currently Serving
            </span>

            <span className="font-semibold">
              {queue.serving}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Called
            </span>

            <span className="font-semibold">
              {queue.called}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Completed Today
            </span>

            <span className="font-semibold">
              {queue.completed}
            </span>
          </div>
        </div>

        <div
          className="
            mt-8
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-100
            py-3
            text-sm
            text-slate-500
          "
        >
          Queue monitoring will be connected in the
          Admin Queue phase.
          <ArrowRight size={16} />
        </div>
      </div>

      {/* SMS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3">
            <BellRing
              className="text-emerald-600"
              size={24}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              SMS Notification Status
            </h2>

            <p className="text-sm text-slate-500">
              Today's notifications
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={18}
                className="text-emerald-500"
              />

              <span className="text-slate-500">
                Messages Sent
              </span>
            </div>

            <span className="font-bold">
              {sms.sent}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle
                size={18}
                className="text-amber-500"
              />

              <span className="text-slate-500">
                Pending
              </span>
            </div>

            <span className="font-bold">
              {sms.pending}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Delivery Success
            </span>

            <span className="font-bold text-emerald-600">
              {deliverySuccess}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Failed
            </span>

            <span className="font-bold text-red-600">
              {sms.failed}
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">
            SMS statistics are based on today's notification
            records.
          </p>
        </div>
      </div>
    </section>
  );
}