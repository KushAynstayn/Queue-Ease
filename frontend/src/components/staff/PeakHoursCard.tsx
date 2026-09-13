import {
  AlertTriangle,
  Clock3,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const peakHours = [
  {
    time: "10:00 AM",
    demand: "28 clients",
    level: "High",
  },
  {
    time: "11:00 AM",
    demand: "24 clients",
    level: "High",
  },
  {
    time: "2:00 PM",
    demand: "23 clients",
    level: "Moderate",
  },
];

export function PeakHoursCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Peak Hours</CardTitle>

            <CardDescription>
              Periods with higher expected queue demand.
            </CardDescription>
          </div>

          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {peakHours.map((peak, index) => (
          <div key={peak.time}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Clock3 className="h-4 w-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="font-medium">
                    {peak.time}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UsersRound className="h-3.5 w-3.5" />
                    {peak.demand}
                  </div>
                </div>
              </div>

              <Badge
                variant={
                  peak.level === "High"
                    ? "destructive"
                    : "secondary"
                }
              >
                {peak.level}
              </Badge>
            </div>

            {index < peakHours.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">
            Preparation Reminder
          </p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Monitor the queue closely before the expected peak
            period and ensure the service counter is available.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}