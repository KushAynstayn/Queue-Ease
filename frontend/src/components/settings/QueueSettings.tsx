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

export default function QueueSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue Settings</CardTitle>

        <CardDescription>
          Configure how the queue operates during the enrollment process.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estimated Service Time */}
        <div className="space-y-2">
          <Label htmlFor="serviceTime">
            Estimated Service Time (minutes)
          </Label>

          <Input
            id="serviceTime"
            type="number"
            defaultValue={15}
            min={1}
          />

          <p className="text-xs text-muted-foreground">
            Used when calculating the estimated waiting time for students.
          </p>
        </div>

        {/* Queue Reset */}
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
            defaultChecked
          />
        </div>

        {/* Maximum Daily Queue */}
        <div className="space-y-2">
          <Label htmlFor="maxQueue">
            Maximum Queue Capacity
          </Label>

          <Input
            id="maxQueue"
            type="number"
            defaultValue={500}
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