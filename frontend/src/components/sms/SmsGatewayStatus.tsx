
import {
  RadioTower,
  ShieldCheck,
  PauseCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export default function SmsGatewayStatus() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>SMS Gateway Status</CardTitle>

        <CardDescription>
          SMS provider integration status.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <RadioTower className="h-5 w-5 text-primary" />

            <div>
              <p className="font-medium">Semaphore SMS API</p>
              <p className="text-sm text-muted-foreground">
                Planned SMS provider
              </p>
            </div>
          </div>

          <Badge variant="secondary">Paused</Badge>
        </div>

        <div className="flex items-start gap-3">
          <PauseCircle className="mt-1 h-5 w-5 text-muted-foreground" />

          <div>
            <p className="font-medium">Delivery Status</p>
            <p className="text-sm text-muted-foreground">
              Actual SMS sending is currently disabled.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-muted-foreground" />

          <div>
            <p className="font-medium">API Credentials</p>
            <p className="text-sm text-muted-foreground">
              Credentials remain on the backend and are never
              exposed through the frontend.
            </p>
          </div>
        </div>

        <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          SMS settings and notification records can be managed
          without submitting messages to Semaphore.
        </p>
      </CardContent>
    </Card>
  );
}
