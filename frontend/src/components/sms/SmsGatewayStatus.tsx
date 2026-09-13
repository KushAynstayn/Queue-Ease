import {
  Activity,
  Clock3,
  KeyRound,
  Server,
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
          Current connection status of the SMS service provider.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-primary" />

            <div>
              <p className="font-medium">
                Semaphore SMS API
              </p>

              <p className="text-sm text-muted-foreground">
                Active SMS Gateway
              </p>
            </div>
          </div>

          <Badge className="bg-green-600 hover:bg-green-600">
            Online
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              Connection Status
            </p>

            <p className="font-medium">
              Connected Successfully
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              Last Connection
            </p>

            <p className="font-medium">
              Just now
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <KeyRound className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm text-muted-foreground">
              API Key
            </p>

            <p className="font-medium tracking-widest">
              ********************
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}