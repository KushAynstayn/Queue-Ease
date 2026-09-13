"use client";

import { BellRing } from "lucide-react";

export default function NotificationHeader() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <BellRing className="h-5 w-5 text-[#2845D6]" />

        <span className="text-sm font-medium text-muted-foreground">
          Notifications
        </span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        SMS Alerts
      </h1>

      <p className="text-sm text-muted-foreground">
        View your queue updates and SMS notification history.
      </p>
    </div>
  );
}