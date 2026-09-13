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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CounterStatus() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>My Counter</CardTitle>

            <CardDescription>
              Current service counter status.
            </CardDescription>
          </div>

          <MonitorCheck className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-xl border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Counter
              </p>

              <p className="mt-1 text-2xl font-bold">
                Counter 02
              </p>
            </div>

            <Badge variant="default">OPEN</Badge>
          </div>

          <Separator className="my-5" />

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Assigned Staff
              </span>

              <span className="font-medium">
                Service Staff
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Current Queue
              </span>

              <span className="font-medium">
                EN-042
              </span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          Close Counter
        </Button>
      </CardContent>
    </Card>
  );
}