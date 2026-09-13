"use client";

import { useMemo } from "react";
import {
  Search,
  Bell,
  CalendarDays,
} from "lucide-react";

export default function DashboardHeader() {
  const today = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }, []);

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Section */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          Welcome back,
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">
          System Administrator
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays
            size={16}
            className="text-[#2845D6]"
          />

          <span>{today}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              py-3
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              focus:border-[#2845D6]
              focus:ring-2
              focus:ring-[#2845D6]/20
              sm:w-72
            "
          />
        </div>

        {/* Notification */}
        <button
          className="
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            transition
            hover:bg-slate-100
          "
        >
          <Bell
            size={20}
            className="text-slate-600"
          />

          <span
            className="
              absolute
              right-2
              top-2
              h-2.5
              w-2.5
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* Profile */}
        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2
            shadow-sm
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#2845D6]
              text-lg
              font-bold
              text-white
            "
          >
            A
          </div>

          <div className="hidden sm:block">
            <p className="font-semibold text-slate-700">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              Queue Ease
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}