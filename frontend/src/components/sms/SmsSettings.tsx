"use client";

import { useEffect, useState } from "react";
import { Bell, Clock, Save } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getSmsSettings,
  updateSmsSettings,
  SmsSettingsPayload,
} from "@/lib/sms";

const initialSettings: SmsSettingsPayload = {
  enabled: false,
  queue_confirmation_enabled: false,
  queue_update_enabled: false,
  now_serving_enabled: false,
  service_delay_enabled: false,
  alert_threshold_minutes: 10,
  sender_name: "",
};

const notificationOptions = [
  {
    key: "queue_confirmation_enabled" as const,
    title: "Queue Confirmation",
    description: "Automatically notify students when they successfully join a queue.",
    icon: Bell,
  },
  {
    key: "now_serving_enabled" as const,
    title: "Now Serving",
    description: "Automatically notify students when staff calls the next student.",
    icon: Clock,
  },
];

export default function SmsSettings() {
  const [settings, setSettings] =
    useState<SmsSettingsPayload>(initialSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await getSmsSettings();

        if (active && response.data) {
          setSettings({
            enabled: Boolean(response.data.enabled),
            queue_confirmation_enabled: Boolean(
              response.data.queue_confirmation_enabled
            ),
            queue_update_enabled: Boolean(
              response.data.queue_update_enabled
            ),
            now_serving_enabled: Boolean(
              response.data.now_serving_enabled
            ),
            service_delay_enabled: Boolean(
              response.data.service_delay_enabled
            ),
            alert_threshold_minutes:
              response.data.alert_threshold_minutes ?? 10,
            sender_name: response.data.sender_name ?? "",
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to retrieve SMS settings."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function updateField(
    field: "enabled" | "queue_confirmation_enabled" | "now_serving_enabled",
    value: boolean
  ) {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await updateSmsSettings({
        ...settings,
        sender_name: settings.sender_name?.trim() || null,
      });

      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save SMS settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>

        <CardDescription>
          Manage automatic SMS notifications.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading SMS settings...
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <p className="font-medium">Enable SMS Notifications</p>

                <p className="text-sm text-muted-foreground">
                  Master switch for all automatic SMS notifications.
                </p>
              </div>

              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) =>
                  updateField("enabled", checked)
                }
              />
            </div>

            <div className="space-y-3">
              {notificationOptions.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-medium">{item.title}</p>

                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={settings[item.key]}
                      disabled={!settings.enabled}
                      onCheckedChange={(checked) =>
                        updateField(item.key, checked)
                      }
                    />
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground">
              Changes will only take effect after saving. Keep SMS disabled
              while testing to avoid consuming provider credits.
            </p>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {saved && (
              <p className="text-sm text-green-600">
                SMS settings saved successfully.
              </p>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}