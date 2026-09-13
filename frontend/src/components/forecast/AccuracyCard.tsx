import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

export default function AccuracyCard() {
  const confidence = 94;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Forecast Accuracy</CardTitle>

        <CardDescription>
          Latest AI model performance.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Confidence Score
            </span>

            <span className="font-semibold">
              {confidence}%
            </span>
          </div>

          <Progress value={confidence} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              RMSE
            </p>

            <p className="mt-2 text-2xl font-bold">
              3.4
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              MAE
            </p>

            <p className="mt-2 text-2xl font-bold">
              2.1
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            Based on the last 30 days of historical queue
            records.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}