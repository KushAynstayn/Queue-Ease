
"use client";

import { MonitorCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Counter = {
  id: number;
  counter_number: string;
  name: string;
  status: "open" | "closed" | "maintenance";
  service_id: number | null;
  service?: {
    id: number;
    name: string;
    code: string;
  } | null;
};

type Props = {
  counters: Counter[];
};

export function CounterStatus({ counters }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>My Counter</CardTitle>
            <CardDescription>
              Your assigned service counter status.
            </CardDescription>
          </div>
          <MonitorCheck className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {counters.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="font-medium">No assigned counter</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact your administrator to check your counter assignment.
            </p>
          </div>
        ) : (
          counters.map((counter) => (
            <div
              key={counter.id}
              className="rounded-xl border p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Counter</p>
                  <p className="mt-1 text-xl font-bold">
                    {counter.name || `Counter ${counter.counter_number}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No. {counter.counter_number}
                  </p>
                </div>

                <Badge
                  variant={
                    counter.status === "open" ? "default" : "secondary"
                  }
                >
                  {counter.status.toUpperCase()}
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="text-right font-medium">
                  {counter.service?.name ?? "No service assigned"}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
