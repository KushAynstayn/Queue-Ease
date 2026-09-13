import {
  BadgeCheck,
  MessageSquare,
  AlertTriangle,
  RadioTower,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const summary = [
  {
    title: "SMS Sent Today",
    value: "248",
    description: "Messages delivered today",
    icon: MessageSquare,
  },
  {
    title: "Successful",
    value: "242",
    description: "Successfully delivered",
    icon: BadgeCheck,
  },
  {
    title: "Failed",
    value: "6",
    description: "Delivery failed",
    icon: AlertTriangle,
  },
  {
    title: "Gateway Status",
    value: "Online",
    description: "Semaphore API",
    icon: RadioTower,
    status: "Online",
  },
];

export default function SmsSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <h2 className="text-3xl font-bold">
                    {item.value}
                  </h2>

                  {item.status && (
                    <Badge className="bg-green-600 hover:bg-green-600">
                      {item.status}
                    </Badge>
                  )}
                </div>

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
    </div>
  );
}