"use client";

import NotificationHeader from "@/components/client/notifications/NotificationHeader";
import NotificationSummary from "@/components/client/notifications/NotificationSummary";
import NotificationList from "@/components/client/notifications/NotificationList";

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <NotificationHeader />

      {/* Summary */}
      <NotificationSummary
        total={5}
        delivered={5}
        latestTime="Today, 10:42 AM"
      />

      {/* Notification History */}
      <NotificationList />
    </div>
  );
} 