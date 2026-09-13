"use client";

import { useMemo, useState } from "react";
import { MessageSquareText, Send } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const templates = {
  "now-serving":
    "Queue Ease: Your queue number {queue} is now being served. Please proceed to Counter {counter}.",

  "queue-update":
    "Queue Ease: Your current queue number is {queue}. There are approximately {ahead} clients ahead of you.",

  "wait-time":
    "Queue Ease: Your estimated waiting time is approximately {wait} minutes. Please stay available for your turn.",

  "service-delay":
    "Queue Ease: There is currently a service delay. We apologize for the inconvenience. Please wait for further updates.",
};

export function SmsComposer() {
  const [template, setTemplate] = useState<string>("now-serving");
  const [recipientGroup, setRecipientGroup] =
    useState<string>("waiting-clients");

  const message = useMemo(() => {
    const selectedTemplate =
      templates[template as keyof typeof templates] ??
      templates["now-serving"];

    return selectedTemplate
      .replace("{queue}", "EN-043")
      .replace("{counter}", "02")
      .replace("{ahead}", "3")
      .replace("{wait}", "12");
  }, [template]);

  const recipientCount =
    recipientGroup === "waiting-clients"
      ? 18
      : recipientGroup === "current-client"
        ? 1
        : 42;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MessageSquareText className="h-5 w-5 text-primary" />
          </div>

          <div>
            <CardTitle>Send SMS</CardTitle>

            <CardDescription>
              Send a queue-related notification to clients.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Message Template */}
        <div className="space-y-2">
          <Label>Message Template</Label>

          <Select
            value={template}
            onValueChange={(value) => {
              if (value) {
                setTemplate(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="now-serving">
                Now Serving
              </SelectItem>

              <SelectItem value="queue-update">
                Queue Update
              </SelectItem>

              <SelectItem value="wait-time">
                Wait Time Update
              </SelectItem>

              <SelectItem value="service-delay">
                Service Delay
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recipient Group */}
        <div className="space-y-2">
          <Label>Recipient Group</Label>

          <Select
            value={recipientGroup}
            onValueChange={(value) => {
              if (value) {
                setRecipientGroup(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="current-client">
                Current Client
              </SelectItem>

              <SelectItem value="waiting-clients">
                Waiting Clients
              </SelectItem>

              <SelectItem value="all-today">
                Today&apos;s Queue Clients
              </SelectItem>
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            {recipientCount} recipient
            {recipientCount !== 1 ? "s" : ""} selected.
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label>Message</Label>

          <Textarea
            value={message}
            readOnly
            className="min-h-[120px] resize-none"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Template message</span>

            <span>{message.length} characters</span>
          </div>
        </div>

        {/* Send */}
        <div className="flex justify-end">
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send SMS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}