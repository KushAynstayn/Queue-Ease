"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SMSSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Settings</CardTitle>

        <CardDescription>
          Configure SMS notifications sent to students during the enrollment
          process.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Enable SMS */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="enableSms">
              Enable SMS Notifications
            </Label>

            <p className="text-sm text-muted-foreground">
              Send queue updates and notifications through SMS.
            </p>
          </div>

          <Switch
            id="enableSms"
            defaultChecked
          />
        </div>

        {/* Sender Name */}
        <div className="space-y-2">
          <Label htmlFor="senderName">
            Sender Name
          </Label>

          <Input
            id="senderName"
            defaultValue="QueueEase"
            placeholder="QueueEase"
          />

          <p className="text-xs text-muted-foreground">
            The sender name displayed in SMS messages, subject to your SMS
            provider's approval.
          </p>
        </div>

        {/* Notification Timing */}
        <div className="space-y-2">
          <Label htmlFor="notificationTime">
            Notify Student Before Their Turn (minutes)
          </Label>

          <Input
            id="notificationTime"
            type="number"
            defaultValue={10}
            min={1}
          />

          <p className="text-xs text-muted-foreground">
            Number of minutes before a student's turn that an SMS reminder is
            sent.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}