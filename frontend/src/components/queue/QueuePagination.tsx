"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface QueuePaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export default function QueuePagination({
  currentPage = 1,
  totalPages = 8,
  totalItems = 124,
  itemsPerPage = 10,
  onPageChange,
}: QueuePaginationProps) {
  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  const generatePages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}

      <div className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-slate-700">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700">
          {totalItems}
        </span>{" "}
        queue records
      </div>

      {/* Right */}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* First */}

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(1)}
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous */}

        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange?.(currentPage - 1)
          }
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Pages */}

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={index}
              className="px-2 text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={`h-10 min-w-[40px] rounded-lg font-medium transition ${
                currentPage === page
                  ? "bg-[#2845D6] text-white shadow"
                  : "border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange?.(currentPage + 1)
          }
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last */}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange?.(totalPages)
          }
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}