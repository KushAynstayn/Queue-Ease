
"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, ApiRequestError } from "@/lib/api";

import ActivityFilters from "@/components/activity/ActivityFilters";
import ActivityTable from "@/components/activity/ActivityTable";
import ActivityPagination from "@/components/activity/ActivityPagination";

interface ActivityUser {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  username: string;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  action: string;
  description: string | null;
  module: string | null;
  target_type: string | null;
  target_id: number | null;
  ip_address: string | null;
  created_at: string;
  user: ActivityUser | null;
}

interface PaginatedActivityLogs {
  current_page: number;
  data: ActivityLog[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

interface ActivityLogsResponse {
  success: boolean;
  message: string;
  data: PaginatedActivityLogs;
}

interface ActivityFiltersState {
  search: string;
  from: string;
  to: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] =
    useState<PaginatedActivityLogs | null>(null);

  const [filters, setFilters] = useState<ActivityFiltersState>({
    search: "",
    from: "",
    to: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      per_page: "10",
      page: String(currentPage),
    });

    if (filters.search.trim()) {
      params.set("search", filters.search.trim());
    }

    if (filters.from) {
      params.set("from", filters.from);
    }

    if (filters.to) {
      params.set("to", filters.to);
    }

    try {
      const response =
        await apiRequest<ActivityLogsResponse>(
          `/activity-logs?${params.toString()}`
        );

      setLogs(response.data.data);
      setPagination(response.data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Unable to retrieve activity logs.");
      }

      setLogs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    void fetchActivityLogs();
  }, [fetchActivityLogs]);

  function handleApplyFilters(nextFilters: ActivityFiltersState) {
    setCurrentPage(1);
    setFilters(nextFilters);
  }

  function handlePageChange(page: number) {
    if (!pagination || page < 1 || page > pagination.last_page) {
      return;
    }

    setCurrentPage(page);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Activity Logs
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor user activities and important system events.
        </p>
      </div>

      <ActivityFilters
        onApply={handleApplyFilters}
        loading={loading}
      />

      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <ActivityTable
        activities={logs}
        loading={loading}
      />

      <ActivityPagination
        currentPage={pagination?.current_page ?? 1}
        lastPage={pagination?.last_page ?? 1}
        from={pagination?.from ?? null}
        to={pagination?.to ?? null}
        total={pagination?.total ?? 0}
        onPageChange={handlePageChange}
        disabled={loading || !pagination}
      />
    </div>
  );
}
