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

export default function SystemSettings() {
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
            <Label htmlFor="systemName">
              System Name
            </Label>

            <Input
              id="systemName"
              defaultValue="Queue Ease"
              placeholder="Enter system name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">
              Organization Name
            </Label>

            <Input
              id="organization"
              defaultValue="Cebu Technological University"
              placeholder="Enter organization name"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="queuePrefix">
              Queue Prefix
            </Label>

            <Input
              id="queuePrefix"
              defaultValue="ENR"
              placeholder="Example: ENR"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">
              Academic Year
            </Label>

            <Input
              id="academicYear"
              defaultValue="2026–2027"
              placeholder="2026–2027"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}