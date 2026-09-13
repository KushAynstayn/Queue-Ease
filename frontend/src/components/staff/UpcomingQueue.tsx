"use client";

import { Clock3, UsersRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const upcomingQueue = [
  {
    queueNumber: "EN-043",
    name: "Maria Santos",
    service: "Enrollment",
    wait: "5 min",
    status: "Waiting",
  },
  {
    queueNumber: "EN-044",
    name: "Pedro Cruz",
    service: "Enrollment",
    wait: "9 min",
    status: "Waiting",
  },
  {
    queueNumber: "EN-045",
    name: "Ana Reyes",
    service: "Registration",
    wait: "13 min",
    status: "Waiting",
  },
  {
    queueNumber: "EN-046",
    name: "Mark Garcia",
    service: "Enrollment",
    wait: "17 min",
    status: "Waiting",
  },
];

export function UpcomingQueue() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Upcoming Queue</CardTitle>

            <CardDescription>
              Students waiting for service.
            </CardDescription>
          </div>

          <UsersRound className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          {upcomingQueue.map((item) => (
            <div
              key={item.queueNumber}
              className="flex flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                  {item.queueNumber.replace("EN-", "")}
                </div>

                <div>
                  <p className="font-medium">{item.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {item.service}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.wait}
                </div>

                <Badge variant="secondary">
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}