import {
  CalendarDays,
  Users,
  Clock3,
  Lightbulb,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PeakDayCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Peak Service Day</CardTitle>

        <CardDescription>
          Highest recorded queue activity.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              Peak Day
            </p>

            <h3 className="font-semibold text-lg">
              Tuesday
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              Clients Served
            </p>

            <h3 className="font-semibold">
              842 Clients
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              Average Waiting Time
            </p>

            <h3 className="font-semibold">
              19 Minutes
            </h3>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex gap-3">
            <Lightbulb className="mt-1 h-5 w-5 text-yellow-500" />

            <div>
              <h4 className="font-medium">
                Recommendation
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                Consider assigning an additional queue
                operator during Tuesdays to reduce
                waiting time and improve service flow.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 