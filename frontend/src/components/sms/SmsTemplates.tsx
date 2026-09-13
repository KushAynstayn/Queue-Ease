"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Bell,
  MessageSquare,
  AlertCircle,
  Pencil,
} from "lucide-react";

const templates = [
  {
    title: "Queue Almost Ready",
    icon: Bell,
    message:
      "Hello {StudentName}, your queue number {QueueNumber} is almost ready. Please proceed to the {Office}.",
  },
  {
    title: "Now Serving",
    icon: MessageSquare,
    message:
      "Your queue number {QueueNumber} is now being served at the {Office}. Please proceed immediately.",
  },
  {
    title: "Missed Queue",
    icon: AlertCircle,
    message:
      "You missed your queue number {QueueNumber}. Please approach the office staff for assistance.",
  },
];

export default function SmsTemplates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Templates</CardTitle>

        <CardDescription>
          Default message templates used for queue notifications.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {templates.map((template) => {
          const Icon = template.icon;

          return (
            <div
              key={template.title}
              className="rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="font-semibold">
                    {template.title}
                  </h3>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-6">
                {template.message}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}