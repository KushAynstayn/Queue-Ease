
"use client";

import { Search, Filter, RotateCcw } from "lucide-react";
import type { QueueFilters as QueueFilterValues } from "@/services/admin/queue.service";

interface QueueFiltersProps {
  filters: QueueFilterValues;
  onChange: (filters: QueueFilterValues) => void;
  onApply: () => void;
  onReset: () => void;
}

const inputClass =
  "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2845D6]";

export default function QueueFilters({
  filters,
  onChange,
  onApply,
  onReset,
}: QueueFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form
        className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <div className="relative w-full xl:max-w-sm">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={filters.search ?? ""}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="Search queue number, student no., or service..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-[#2845D6] focus:ring-2 focus:ring-[#2845D6]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Service filter"
            value={filters.service_id ?? ""}
            onChange={(event) =>
              onChange({ ...filters, service_id: event.target.value })
            }
            className={inputClass}
          >
            <option value="">All Services</option>
          </select>

          <select
            aria-label="Status filter"
            value={filters.status ?? ""}
            onChange={(event) =>
              onChange({ ...filters, status: event.target.value })
            }
            className={inputClass}
          >
            <option value="">All Status</option>
            <option value="waiting">Waiting</option>
            <option value="called">Called</option>
            <option value="serving">Serving</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>

          <input
            aria-label="Queue date filter"
            type="date"
            value={filters.queue_date ?? ""}
            onChange={(event) =>
              onChange({ ...filters, queue_date: event.target.value })
            }
            className={inputClass}
          />

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 transition hover:bg-slate-100"
          >
            <Filter size={18} />
            Filter
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-red-600 transition hover:bg-red-100"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
