
"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface QueuePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  from: number | null;
  to: number | null;
  onPageChange: (page: number) => void;
}

export default function QueuePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  from,
  to,
  onPageChange,
}: QueuePaginationProps) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);
  }

  const startItem = totalItems === 0 ? 0 : from ?? (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : to ?? Math.min(currentPage * itemsPerPage, totalItems);

  function pageButton(page: number, label: React.ReactNode, title: string) {
    return (
      <button
        key={title}
        type="button"
        title={title}
        aria-label={title}
        disabled={page === currentPage || page < 1 || page > totalPages}
        onClick={() => onPageChange(page)}
        className={`rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 ${
          page === currentPage ? "bg-[#2845D6] text-white" : ""
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">{startItem}</span> to{" "}
        <span className="font-semibold text-slate-700">{endItem}</span> of{" "}
        <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
        queue records
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {pageButton(1, <ChevronsLeft size={18} />, "First page")}
        {pageButton(
          currentPage - 1,
          <ChevronLeft size={18} />,
          "Previous page"
        )}

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => onPageChange(page)}
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

        {pageButton(
          currentPage + 1,
          <ChevronRight size={18} />,
          "Next page"
        )}
        {pageButton(
          totalPages,
          <ChevronsRight size={18} />,
          "Last page"
        )}
      </div>
    </div>
  );
}
