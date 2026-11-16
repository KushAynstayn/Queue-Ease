
"use client";

import { useCallback, useEffect, useState } from "react";
import QueueHeader from "@/components/queue/QueueHeader";
import QueueStats from "@/components/queue/QueueStats";
import QueueFilters from "@/components/queue/QueueFilters";
import QueueTable from "@/components/queue/QueueTable";
import QueuePagination from "@/components/queue/QueuePagination";
import {
  getQueues,
  type QueuePageData,
  type QueueFilters as QueueFilterValues,
} from "@/services/admin/queue.service";

const EMPTY_PAGE: QueuePageData = {
  records: [],
  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  totalItems: 0,
  from: null,
  to: null,
};

export default function QueuePage() {
  const [filters, setFilters] = useState<QueueFilterValues>({
    search: "",
    status: "",
    service_id: "",
    queue_date: new Date().toISOString().slice(0, 10),
    page: 1,
    per_page: 10,
  });

  const [appliedFilters, setAppliedFilters] =
    useState<QueueFilterValues>(filters);
  const [queuePage, setQueuePage] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  const loadQueues = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getQueues(appliedFilters);
      setQueuePage(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load queues."
      );
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, refreshKey]);

  useEffect(() => {
    void loadQueues();
  }, [loadQueues]);

  function applyFilters() {
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
  }

  function resetFilters() {
    const reset: QueueFilterValues = {
      search: "",
      status: "",
      service_id: "",
      queue_date: new Date().toISOString().slice(0, 10),
      page: 1,
      per_page: 10,
    };

    setFilters(reset);
    setAppliedFilters(reset);
  }

  function changePage(page: number) {
    const next = { ...appliedFilters, page };
    setFilters(next);
    setAppliedFilters(next);
  }

  function refreshQueues() {
    setRefreshKey((value) => value + 1);
  }

  return (
    <div className="space-y-8">
      <QueueHeader onRefresh={refreshQueues} />

      <QueueStats />

      <QueueFilters
        filters={filters}
        onChange={setFilters}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={refreshQueues}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <QueueTable
        queues={queuePage.records}
        loading={loading}
        onStatusUpdated={refreshQueues}
      />

      <QueuePagination
        currentPage={queuePage.currentPage}
        totalPages={queuePage.totalPages}
        totalItems={queuePage.totalItems}
        itemsPerPage={queuePage.perPage}
        from={queuePage.from}
        to={queuePage.to}
        onPageChange={changePage}
      />
    </div>
  );
}
