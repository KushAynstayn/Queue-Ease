"use client";

import Link from "next/link";
import {
  ArrowRight,
  History,
  Plus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/client/queue"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#2845D6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2845D6]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Join Queue
        </Link>

        <Link
          href="/client/history"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <History className="mr-2 h-4 w-4" />
          Queue History
        </Link>

        <Link
          href="/client/notifications"
          className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Notifications
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}