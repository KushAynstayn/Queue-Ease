"use client";

import { useCallback, useEffect, useState } from "react";

import { apiRequest, ApiRequestError } from "@/lib/api";

import NotificationHeader from "@/components/client/notifications/NotificationHeader";
import NotificationSummary from "@/components/client/notifications/NotificationSummary";
import NotificationList, {
  type ClientNotification,
} from "@/components/client/notifications/NotificationList";

interface NotificationSummaryData {
  total: number;
  delivered: number;
  latest_notification_at: string | null;
}

interface PaginatedNotifications {
  data: ClientNotification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ClientNotificationsApiResponse {
  success: boolean;
  message: string;
  data: {
    summary: NotificationSummaryData;
    notifications: PaginatedNotifications;
  };
}

function formatLatestTime(value: string | null): string {
  if (!value) return "No notifications yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Page() {
  const [summary, setSummary] = useState<NotificationSummaryData>({
    total: 0,
    delivered: 0,
    latest_notification_at: null,
  });

  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(currentPage),
      per_page: "10",
    });

    if (search.trim()) {
      params.set("search", search.trim());
    }

    try {
      const response =
        await apiRequest<ClientNotificationsApiResponse>(
          `/client/notifications?${params.toString()}`
        );

      setSummary(response.data.summary);
      setNotifications(response.data.notifications.data);
      setCurrentPage(response.data.notifications.current_page);
      setLastPage(response.data.notifications.last_page);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Unable to retrieve your notifications."
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <NotificationHeader />

      <NotificationSummary
        total={summary.total}
        delivered={summary.delivered}
        latestTime={formatLatestTime(summary.latest_notification_at)}
      />

      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
        search={search}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={setCurrentPage}
        onRetry={fetchNotifications}
      />
    </div>
  );
}