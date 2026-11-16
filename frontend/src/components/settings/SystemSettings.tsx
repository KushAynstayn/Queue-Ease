
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

interface GeneralSettings {
  system_name: string;
  organization_name: string;
  queue_prefix: string;
  academic_year: string;
  estimated_service_minutes: number;
  daily_queue_reset: boolean;
  maximum_queue_capacity: number;
}

interface SystemSettingsProps {
  settings: GeneralSettings;
  onChange: React.Dispatch<React.SetStateAction<GeneralSettings>>;
}

export default function SystemSettings({
  settings,
  onChange,
}: SystemSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>

        <CardDescription>
          Configure the basic information of your Queue Ease system.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="systemName">System Name</Label>

            <Input
              id="systemName"
              value={settings.system_name}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  system_name: e.target.value,
                }))
              }
              placeholder="Enter system name"
              maxLength={150}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization Name</Label>

            <Input
              id="organization"
              value={settings.organization_name}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  organization_name: e.target.value,
                }))
              }
              placeholder="Enter organization name"
              maxLength={150}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="queuePrefix">Queue Prefix</Label>

            <Input
              id="queuePrefix"
              value={settings.queue_prefix}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  queue_prefix: e.target.value.toUpperCase(),
                }))
              }
              placeholder="Example: ENR"
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>

            <Input
              id="academicYear"
              value={settings.academic_year}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  academic_year: e.target.value,
                }))
              }
              placeholder="2026-2027"
              maxLength={20}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
