"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SmsStatusCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            SMS Notifications
          </CardTitle>

          <MessageSquareText className="h-5 w-5 text-[#2845D6]" />
        </div>

        <p className="text-sm text-muted-foreground">
          Your latest queue notification
        </p>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">
                  Queue update sent
                </p>

                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700"
                >
                  Delivered
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Your queue number A-024 is currently waiting.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Today at 10:42 AM
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/client/notifications"
          className="mt-3 inline-flex h-10 w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          View Notifications
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}