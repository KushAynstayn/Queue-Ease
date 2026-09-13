"use client";

import {
  CheckCircle2,
  Clock3,
  MessageSquareText,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface NotificationSummaryProps {
  total: number;
  delivered: number;
  latestTime: string;
}

export default function NotificationSummary({
  total,
  delivered,
  latestTime,
}: NotificationSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2845D6]/10">
            <MessageSquareText className="h-5 w-5 text-[#2845D6]" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Total Notifications
            </p>

            <p className="mt-1 text-xl font-semibold">
              {total}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Delivered
            </p>

            <p className="mt-1 text-xl font-semibold">
              {delivered}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Clock3 className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Latest Notification
            </p>

            <p className="mt-1 text-sm font-semibold">
              {latestTime}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}