import {
  CheckCircle2,
  Clock3,
  MessageSquare,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusItems = [
  {
    title: "Sent Today",
    value: "38",
    icon: CheckCircle2,
  },
  {
    title: "Pending",
    value: "2",
    icon: Clock3,
  },
  {
    title: "Failed",
    value: "1",
    icon: XCircle,
  },
];

export function SmsStatusCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />

          <CardTitle>SMS Status</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {statusItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-lg border p-3 text-center"
              >
                <Icon className="mx-auto h-4 w-4 text-muted-foreground" />

                <p className="mt-2 text-xl font-bold">
                  {item.value}
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}