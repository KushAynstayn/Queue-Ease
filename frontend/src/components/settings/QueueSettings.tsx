
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

interface GeneralSettings {
  system_name: string;
  organization_name: string;
  queue_prefix: string;
  academic_year: string;
  estimated_service_minutes: number;
  daily_queue_reset: boolean;
  maximum_queue_capacity: number;
}

interface QueueSettingsProps {
  settings: GeneralSettings;
  onChange: React.Dispatch<React.SetStateAction<GeneralSettings>>;
}

export default function QueueSettings({
  settings,
  onChange,
}: QueueSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue Settings</CardTitle>

        <CardDescription>
          Configure how the queue operates during the enrollment process.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="serviceTime">
            Estimated Service Time (minutes)
          </Label>

          <Input
            id="serviceTime"
            type="number"
            value={settings.estimated_service_minutes}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                estimated_service_minutes:
                  Number(e.target.value),
              }))
            }
            min={1}
          />

          <p className="text-xs text-muted-foreground">
            Used when calculating the estimated waiting time for students.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="queueReset">
              Daily Queue Reset
            </Label>

            <p className="text-sm text-muted-foreground">
              Automatically reset all queue numbers at the start of each day.
            </p>
          </div>

          <Switch
            id="queueReset"
            checked={settings.daily_queue_reset}
            onCheckedChange={(checked) =>
              onChange((prev) => ({
                ...prev,
                daily_queue_reset: checked,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxQueue">
            Maximum Queue Capacity
          </Label>

          <Input
            id="maxQueue"
            type="number"
            value={settings.maximum_queue_capacity}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                maximum_queue_capacity:
                  Number(e.target.value),
              }))
            }
            min={1}
          />

          <p className="text-xs text-muted-foreground">
            Maximum number of queue tickets that can be issued in one day.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
