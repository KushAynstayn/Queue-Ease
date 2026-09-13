"use client";

import { useState } from "react";
import {
  BellRing,
  Check,
  CircleUserRound,
  Monitor,
  Save,
  Volume2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

export function StaffProfileForm() {
  const [displayName, setDisplayName] =
    useState("Enrollment Staff");

  const [email, setEmail] =
    useState("staff@queueease.edu");

  const [counter, setCounter] =
    useState("counter-01");

  const [smsAlerts, setSmsAlerts] =
    useState(true);

  const [notificationSound, setNotificationSound] =
    useState(true);

  const [theme, setTheme] =
    useState("system");

  const [saved, setSaved] =
    useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CircleUserRound className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Profile Information</CardTitle>

              <CardDescription>
                View and update your staff account information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display-name">
                Display Name
              </Label>

              <Input
                id="display-name"
                value={displayName}
                onChange={(event) =>
                  setDisplayName(event.target.value)
                }
                placeholder="Enter your display name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address
              </Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email address"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role
              </Label>

              <Input
                id="role"
                value="Service Staff"
                disabled
              />

              <p className="text-xs text-muted-foreground">
                Your role is managed by the system administrator.
              </p>
            </div>

            {/* Assigned Counter */}
            <div className="space-y-2">
              <Label>Assigned Counter</Label>

              <Select
                value={counter}
                onValueChange={(value) => {
                  if (value) {
                    setCounter(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select counter" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="counter-01">
                    Counter 01
                  </SelectItem>

                  <SelectItem value="counter-02">
                    Counter 02
                  </SelectItem>

                  <SelectItem value="counter-03">
                    Counter 03
                  </SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                The counter you are currently assigned to operate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BellRing className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Notification Preferences</CardTitle>

              <CardDescription>
                Configure how Queue Ease notifies you about
                important queue events.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SMS Alerts */}
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <BellRing className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  SMS Alerts
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Receive notifications about important queue
                  and SMS events.
                </p>
              </div>
            </div>

            <Switch
              checked={smsAlerts}
              onCheckedChange={setSmsAlerts}
              aria-label="Toggle SMS alerts"
            />
          </div>

          {/* Notification Sound */}
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Volume2 className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  Notification Sound
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Play a sound when an important queue event
                  requires your attention.
                </p>
              </div>
            </div>

            <Switch
              checked={notificationSound}
              onCheckedChange={setNotificationSound}
              aria-label="Toggle notification sound"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Monitor className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Appearance</CardTitle>

              <CardDescription>
                Choose how the Staff dashboard should appear.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="max-w-md space-y-2">
            <Label>Theme</Label>

            <Select
              value={theme}
              onValueChange={(value) => {
                if (value) {
                  setTheme(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="system">
                  System Default
                </SelectItem>

                <SelectItem value="light">
                  Light
                </SelectItem>

                <SelectItem value="dark">
                  Dark
                </SelectItem>
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              This preference will be connected to the system
              theme settings during backend integration.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Changes Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}