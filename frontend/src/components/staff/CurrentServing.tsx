"use client";

import {
  CheckCircle2,
  Clock3,
  PhoneCall,
  RotateCcw,
  SkipForward,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function CurrentServing() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Currently Serving</CardTitle>

            <CardDescription>
              Manage the student currently assigned to your counter.
            </CardDescription>
          </div>

          <Badge variant="default">SERVING</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-xl border bg-muted/30 p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Queue Number
              </p>

              <p className="mt-1 text-4xl font-bold tracking-tight">
                EN-042
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <UserRound className="h-7 w-7 text-primary" />
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Student</p>
              <p className="mt-1 font-medium">Juan Dela Cruz</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Service</p>
              <p className="mt-1 font-medium">Enrollment</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Waiting Time</p>

              <div className="mt-1 flex items-center gap-1.5 font-medium">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                12 min
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete
          </Button>

          <Button variant="outline">
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>

          <Button variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Recall
          </Button>

          <Button variant="secondary" className="ml-auto">
            <PhoneCall className="mr-2 h-4 w-4" />
            Call Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}