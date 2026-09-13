import { Clock3, MessageSquare } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const smsLogs = [
  {
    time: "9:42 AM",
    recipient: "Juan Dela Cruz",
    queue: "EN-042",
    type: "Now Serving",
    status: "Sent",
  },
  {
    time: "9:35 AM",
    recipient: "Maria Santos",
    queue: "EN-043",
    type: "Queue Update",
    status: "Sent",
  },
  {
    time: "9:28 AM",
    recipient: "Pedro Cruz",
    queue: "EN-044",
    type: "Wait Time",
    status: "Pending",
  },
  {
    time: "9:21 AM",
    recipient: "Ana Reyes",
    queue: "EN-045",
    type: "Queue Update",
    status: "Sent",
  },
  {
    time: "9:12 AM",
    recipient: "Mark Garcia",
    queue: "EN-046",
    type: "Service Delay",
    status: "Failed",
  },
];

function getStatusVariant(status: string) {
  switch (status) {
    case "Sent":
      return "secondary";

    case "Pending":
      return "outline";

    case "Failed":
      return "destructive";

    default:
      return "outline";
  }
}

export function SmsLogs() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Recent SMS Logs</CardTitle>

            <CardDescription>
              Recent notifications processed by the system.
            </CardDescription>
          </div>

          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  Time
                </th>

                <th className="px-4 py-3 font-medium">
                  Recipient
                </th>

                <th className="px-4 py-3 font-medium">
                  Queue
                </th>

                <th className="px-4 py-3 font-medium">
                  Message Type
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {smsLogs.map((log) => (
                <tr
                  key={`${log.time}-${log.queue}`}
                  className="border-b last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {log.time}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-medium">
                      {log.recipient}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {log.queue}
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {log.type}
                  </td>

                  <td className="px-4 py-4">
                    <Badge variant={getStatusVariant(log.status)}>
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}