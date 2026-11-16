
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

import type { ForecastingData } from "@/types/forecast";

interface PeakHoursCardProps {
  historicalData: ForecastingData[];
  loading: boolean;
}

export function PeakHoursCard({
  historicalData,
  loading,
}: PeakHoursCardProps) {
  const peakHours = Object.values(
    historicalData.reduce<
      Record<string, { time: string; demand: number }>
    >((groups, record) => {
      if (!record.peak_hour || record.total_transactions == null) {
        return groups;
      }

      const time = record.peak_hour;
      const demand = Number(record.total_transactions);

      if (!Number.isFinite(demand)) {
        return groups;
      }

      if (!groups[time]) {
        groups[time] = { time, demand: 0 };
      }

      groups[time].demand += demand;

      return groups;
    }, {})
  )
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 3);

  const highestDemand = peakHours[0]?.demand ?? 0;

  function getDemandLevel(demand: number) {
    if (highestDemand > 0 && demand >= highestDemand * 0.8) {
      return "High";
    }

    return "Moderate";
  }

  function formatPeakHour(value: string) {
    const match = value.match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?$/);

    if (!match) return value;

    const hour = Number(match[1]);
    const minute = Number(match[2] ?? 0);

    if (hour > 23 || minute > 59) return value;

    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Peak Hours</CardTitle>

            <CardDescription>
              Busiest hours derived from available historical records.
            </CardDescription>
          </div>

          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading historical peak-hour data...
          </p>
        ) : peakHours.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No historical peak-hour data is available yet.
          </p>
        ) : (
          peakHours.map((peak, index) => {
            const level = getDemandLevel(peak.demand);

            return (
              <div key={peak.time}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Clock3 className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="font-medium">
                        {formatPeakHour(peak.time)}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <UsersRound className="h-3.5 w-3.5" />
                        {peak.demand.toLocaleString()} recorded transactions
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={level === "High" ? "destructive" : "secondary"}
                  >
                    {level}
                  </Badge>
                </div>

                {index < peakHours.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            );
          })
        )}

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">Preparation Reminder</p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Use historical busy periods as a planning reference. Actual
            queue demand may differ, so monitor the live queue before
            adjusting counter staffing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
