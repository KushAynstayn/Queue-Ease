import { RadioTower, ShieldCheck } from "lucide-react";

import SmsSummary from "@/components/sms/SmsSummary";
import SmsSettings from "@/components/sms/SmsSettings";
import SmsLogsTable from "@/components/sms/SmsLogsTable";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SmsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          SMS Notifications
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor automated SMS notifications and manage notification settings.
        </p>
      </div>

      <SmsSummary />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>SMS Gateway</CardTitle>
            <CardDescription>
              Current SMS provider configuration.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <RadioTower className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1">
                <p className="font-medium">UniSMS API</p>
                <p className="text-sm text-muted-foreground">
                  Configured through the Laravel backend.
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Configured
              </span>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">API Credentials</p>
                <p className="text-sm text-muted-foreground">
                  API credentials are stored securely on the backend and are
                  never exposed through the frontend.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              SMS sending remains controlled by the notification settings.
              No test messages are sent from this page.
            </div>
          </CardContent>
        </Card>

        <SmsSettings />
      </div>

      <SmsLogsTable />
    </div>
  );
}