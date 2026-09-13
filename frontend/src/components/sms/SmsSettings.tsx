"use client";

import {
  Bell,
  ClockAlert,
  MessageCircleMore,
  ShieldCheck,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const settings = [
  {
    title: "Queue Almost Ready",
    description:
      "Notify students when they are a few queue numbers away.",
    icon: Bell,
    enabled: true,
  },
  {
    title: "Now Serving",
    description:
      "Send an SMS when the student's queue number is currently being served.",
    icon: MessageCircleMore,
    enabled: true,
  },
  {
    title: "Missed Queue",
    description:
      "Notify students if their queue number has been skipped.",
    icon: ClockAlert,
    enabled: true,
  },
  {
    title: "Daily System Summary",
    description:
      "Send a daily SMS summary to administrators (optional).",
    icon: ShieldCheck,
    enabled: false,
  },
];

export default function SmsSettings() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>

        <CardDescription>
          Configure which SMS notifications are enabled.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {settings.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex gap-4">
                <div className="rounded-full bg-primary/10 p-3 h-fit">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h4 className="font-medium">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>

              <Switch defaultChecked={item.enabled} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}