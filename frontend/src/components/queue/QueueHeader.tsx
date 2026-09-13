 "use client";

import Link from "next/link";
import {
  ChevronRight,
  Plus,
  Download,
  RefreshCw,
} from "lucide-react";

import { useState } from "react";

import AddQueueDialog from "./dialogs/AddQueueDialog";

export default function QueueHeader() {
    const [openAddDialog, setOpenAddDialog] =
    useState(false);
  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        {/* Breadcrumb */}

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

        {/* Title */}

        <h1 className="text-3xl font-bold text-slate-800">
          Queue Monitoring
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Monitor, manage, and oversee all active queues in real time.
          Track client progress, update queue status, and maintain
          efficient service operations.
        </p>
      </div>

      {/* Right */}

      <div className="flex flex-wrap gap-3">
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
            text-slate-600
            shadow-sm
            transition
            hover:bg-slate-100
          "
        >
          <RefreshCw size={18} />

          Refresh
        </button>

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
            text-slate-600
            shadow-sm
            transition
            hover:bg-slate-100
          "
        >
          <Download size={18} />

          Export
        </button>

        <button
        onClick={() => setOpenAddDialog(true)}
        className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#2845D6]
            px-5
            py-3
            font-medium
            text-white
            shadow-lg
            transition
            hover:bg-[#1f39bb]
        "
        >
        <Plus size={18} />

            Add Queue
        </button>
      </div>

      <AddQueueDialog
            open={openAddDialog}
            onOpenChange={setOpenAddDialog}
        />
    </section>
  );
}