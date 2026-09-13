"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Hash,
  GraduationCap,
  TicketCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QueueConfirmationProps {
  queueNumber: string;
  serviceName: string;
  estimatedWait: string;
  status: string;
}

export default function QueueConfirmation({
  queueNumber,
  serviceName,
  estimatedWait,
  status,
}: QueueConfirmationProps) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader className="items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>

          <CardTitle className="mt-2 text-xl">
            Queue Request Confirmed
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Your enrollment queue request has been successfully received.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Queue Number */}
          <div className="rounded-xl border bg-muted/30 p-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Your Queue Number
            </p>

            <div className="mt-2 flex items-center justify-center gap-2">
              <Hash className="h-5 w-5 text-[#2845D6]" />

              <p className="text-5xl font-bold tracking-tight text-[#2845D6]">
                {queueNumber}
              </p>
            </div>

            <Badge className="mt-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {status}
            </Badge>
          </div>

          {/* Queue Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Selected Service
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {serviceName}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Estimated Wait
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {estimatedWait}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="rounded-lg border border-[#2845D6]/20 bg-[#2845D6]/5 p-4">
            <div className="flex items-start gap-3">
              <TicketCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2845D6]" />

              <div>
                <p className="text-sm font-medium">
                  Keep your queue number
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Monitor your queue status for updates. You may also
                  receive SMS notifications regarding your enrollment queue.
                </p>
              </div>
            </div>
          </div>

          {/* View Queue Status */}
          <Link
            href="/client/queue"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#2845D6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2845D6]/90"
          >
            View Queue Status
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}