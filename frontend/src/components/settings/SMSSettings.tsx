
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

interface SmsSettings {
  enabled: boolean;
  queue_confirmation_enabled: boolean;
  queue_update_enabled: boolean;
  now_serving_enabled: boolean;
  service_delay_enabled: boolean;
  alert_threshold_minutes: number;
  sender_name: string | null;
}

interface SMSSettingsProps {
  settings: SmsSettings;
  onChange: React.Dispatch<React.SetStateAction<SmsSettings>>;
}

export default function SMSSettings({
  settings,
  onChange,
}: SMSSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Settings</CardTitle>

        <CardDescription>
          Configure SMS notifications sent to students during the enrollment process.
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
            checked={settings.enabled}
            onCheckedChange={(checked) =>
              onChange((prev) => ({
                ...prev,
                enabled: checked,
              }))
            }
          />
        </div>

        {/* Sender Name */}
        <div className="space-y-2">
          <Label htmlFor="senderName">
            Sender Name
          </Label>

          <Input
            id="senderName"
            value={settings.sender_name ?? ""}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                sender_name: e.target.value,
              }))
            }
            placeholder="QueueEase"
            maxLength={50}
          />

          <p className="text-xs text-muted-foreground">
            The sender name displayed in SMS messages, subject to your SMS provider's approval.
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
            value={settings.alert_threshold_minutes}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                alert_threshold_minutes: Number(e.target.value),
              }))
            }
            min={0}
          />

          <p className="text-xs text-muted-foreground">
            Number of minutes before a student's turn that an SMS reminder is sent.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
