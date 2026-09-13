"use client";

import {
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";

export default function QueueFilters() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Search */}

        <div className="relative w-full xl:max-w-sm">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search queue number or client..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              py-3
              pl-11
              pr-4
              outline-none
              transition
              focus:border-[#2845D6]
              focus:ring-2
              focus:ring-[#2845D6]/20
            "
          />
        </div>

        {/* Filters */}

        <div className="flex flex-wrap items-center gap-3">
          {/* Service */}

          <select
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-[#2845D6]
            "
          >
            <option>All Services</option>

            <option>Registrar</option>

            <option>Cashier</option>

            <option>Admission</option>

            <option>Accounting</option>

            <option>Guidance</option>
          </select>

          {/* Status */}

          <select
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-[#2845D6]
            "
          >
            <option>All Status</option>

            <option>Waiting</option>

            <option>Serving</option>

            <option>Completed</option>

            <option>Cancelled</option>
          </select>

          {/* Date */}

          <input
            type="date"
            className="
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-[#2845D6]
            "
          />

          {/* Filter */}

          <button
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              transition
              hover:bg-slate-100
            "
          >
            <Filter size={18} />

            Filter
          </button>

          {/* Reset */}

          <button
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-50
              px-5
              py-3
              text-red-600
              transition
              hover:bg-red-100
            "
          >
            <RotateCcw size={18} />

            Reset
          </button>
        </div>
      </div>
    </section>
  );
}