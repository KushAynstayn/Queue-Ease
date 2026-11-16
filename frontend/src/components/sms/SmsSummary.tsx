"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock,
  Send,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getSmsSummary, SmsSummaryData } from "@/lib/sms";

const summaryCards = [
  {
    key: "sent",
    title: "Sent Today",
    description: "Accepted by the SMS provider",
    icon: Send,
  },
  {
    key: "pending",
    title: "Pending",
    description: "Awaiting processing",
    icon: Clock,
  },
  {
    key: "failed",
    title: "Failed",
    description: "Unsuccessful SMS attempts",
    icon: AlertTriangle,
  },
] as const;

export default function SmsSummary() {
  const [summary, setSummary] = useState<SmsSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const response = await getSmsSummary();

        if (active) {
          setSummary(response.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to retrieve SMS summary."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryCards.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.key}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {loading
                    ? "..."
                    : summary
                      ? summary[item.key]
                      : "—"}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="rounded-full bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}

      {error && (
        <p className="text-sm text-destructive sm:col-span-2 xl:col-span-3">
          {error}
        </p>
      )}
    </div>
  );
}