"use client";

import {
  CheckCircle2,
  Clock3,
  Hash,
  MapPin,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QueueStatusCardProps {
  queueNumber: string;
  serviceName: string;
  status: string;
  position: number;
  estimatedWait: string;
  currentServing: string;
}

export default function QueueStatusCard({
  queueNumber,
  serviceName,
  status,
  position,
  estimatedWait,
  currentServing,
}: QueueStatusCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20 text-center">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <CardTitle className="text-base">
            Your Queue Status
          </CardTitle>
        </div>

        <p className="text-sm text-muted-foreground">
          Your enrollment queue is currently active.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Queue Number */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Queue Number
          </p>

          <div className="mt-2 flex items-center justify-center gap-2">
            <Hash className="h-5 w-5 text-[#2845D6]" />

            <span className="text-5xl font-bold tracking-tight text-[#2845D6]">
              {queueNumber}
            </span>
          </div>

          <Badge className="mt-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            {status}
          </Badge>
        </div>

        {/* Queue Information */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2845D6]/10">
              <Users className="h-5 w-5 text-[#2845D6]" />
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Your Position
            </p>

            <p className="mt-1 text-xl font-semibold">
              {position}
            </p>

            <p className="text-xs text-muted-foreground">
              in queue
            </p>
          </div>

          <div className="rounded-xl border p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2845D6]/10">
              <Clock3 className="h-5 w-5 text-[#2845D6]" />
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Estimated Wait
            </p>

            <p className="mt-1 text-xl font-semibold">
              {estimatedWait}
            </p>

            <p className="text-xs text-muted-foreground">
              remaining
            </p>
          </div>

          <div className="rounded-xl border p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2845D6]/10">
              <Hash className="h-5 w-5 text-[#2845D6]" />
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Currently Serving
            </p>

            <p className="mt-1 text-xl font-semibold">
              {currentServing}
            </p>

            <p className="text-xs text-muted-foreground">
              now serving
            </p>
          </div>
        </div>

        {/* Service */}
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Enrollment Service
            </p>

            <p className="mt-1 text-sm font-semibold">
              {serviceName}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}