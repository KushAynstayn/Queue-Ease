"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface UserPaginationProps {
  currentPage: number;
  lastPage: number;
  from: number | null;
  to: number | null;
  total: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function UserPagination({
  currentPage,
  lastPage,
  from,
  to,
  total,
  onPageChange,
  isLoading,
}: UserPaginationProps) {
  const pages = Array.from(
    { length: lastPage },
    (_, index) => index + 1
  );

  return (
    <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">
          {from ?? 0}–{to ?? 0}
        </span>{" "}
        of{" "}
        <span className="font-medium">
          {total}
        </span>{" "}
        users
      </p>

      {lastPage > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={
              isLoading || currentPage === 1
            }
            onClick={() =>
              onPageChange(currentPage - 1)
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pages.map((page) => (
            <Button
              key={page}
              variant={
                page === currentPage
                  ? "default"
                  : "outline"
              }
              size="sm"
              disabled={isLoading}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            disabled={
              isLoading ||
              currentPage === lastPage
            }
            onClick={() =>
              onPageChange(currentPage + 1)
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}