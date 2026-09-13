"use client";

import {
  BrainCircuit,
  Clock3,
  TrendingUp,
  Users,
  BellRing,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function DashboardCards() {
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
              Tomorrow's prediction
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Expected Clients
            </span>

            <span className="font-bold text-slate-800">
              286
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Predicted Peak Hour
            </span>

            <span className="font-bold text-slate-800">
              10:00 AM
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Confidence
            </span>

            <span className="font-bold text-emerald-600">
              96.4%
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <TrendingUp
              className="mt-1 text-[#2845D6]"
              size={20}
            />

            <p className="text-sm leading-6 text-slate-600">
              AI recommends assigning an additional
              staff member between{" "}
              <strong>9:30 AM</strong> and{" "}
              <strong>11:30 AM</strong> due to
              predicted high queue demand.
            </p>
          </div>
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
                Average Waiting Time
              </span>
            </div>

            <span className="font-semibold">
              14 mins
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Active Counters
            </span>

            <span className="font-semibold">
              5 / 6
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Longest Queue
            </span>

            <span className="font-semibold">
              Registrar
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Waiting Clients
            </span>

            <span className="font-semibold">
              37
            </span>
          </div>
        </div>

        <button
          className="
            mt-8
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#2845D6]
            py-3
            text-white
            transition
            hover:bg-[#1d35b3]
          "
        >
          View Queue Monitoring

          <ArrowRight size={18} />
        </button>
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
              Semaphore Gateway
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
              189
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
              6
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Delivery Success
            </span>

            <span className="font-bold text-emerald-600">
              98.2%
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">
            SMS gateway is operating normally.
            All queued notifications are expected
            to be delivered successfully.
          </p>
        </div>
      </div>
    </section>
  );
}