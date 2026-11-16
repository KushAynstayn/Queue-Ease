
"use client";

import Link from "next/link";
import {
  ChevronRight,
  Download,
  RefreshCw,
} from "lucide-react";

interface QueueHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  refreshing?: boolean;
}

export default function QueueHeader({
  onRefresh,
  onExport,
  refreshing = false,
}: QueueHeaderProps) {
  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/admin"
            className="transition hover:text-[#2845D6]"
          >
            Dashboard
          </Link>

          <ChevronRight size={16} />

          <span className="font-medium text-slate-700">
            Queue Monitoring
          </span>
        </div>

        <h1 className="text-3xl font-bold text-slate-800">
          Queue Monitoring
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Monitor, manage, and oversee all active queues in real time.
          Track client progress, update queue status, and maintain
          efficient service operations.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-600 shadow-sm transition hover:bg-slate-100"
        >
          <Download size={18} />
          Export
        </button>
      </div>
    </section>
  );
}
