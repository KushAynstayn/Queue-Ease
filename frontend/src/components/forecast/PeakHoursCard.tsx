import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const peakHours = [
  {
    time: "10:00 AM",
    visitors: 128,
    level: "Very High",
  },
  {
    time: "11:00 AM",
    visitors: 118,
    level: "High",
  },
  {
    time: "1:00 PM",
    visitors: 96,
    level: "Medium",
  },
  {
    time: "3:00 PM",
    visitors: 72,
    level: "Low",
  },
];

export default function PeakHoursCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Predicted Peak Hours</CardTitle>

        <CardDescription>
          Estimated busiest service periods today.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {peakHours.map((hour) => (
          <div
            key={hour.time}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-semibold">{hour.time}</p>

              <p className="text-sm text-muted-foreground">
                {hour.visitors} expected visitors
              </p>
            </div>

            <Badge variant="secondary">
              {hour.level}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}