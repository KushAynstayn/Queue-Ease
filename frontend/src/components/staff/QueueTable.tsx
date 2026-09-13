"use client";

import { Clock3, UserRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { QueueActions } from "./QueueActions";

const queueData = [
  {
    queueNumber: "EN-041",
    student: "John Reyes",
    service: "Enrollment",
    wait: "8 min",
    status: "Completed",
  },
  {
    queueNumber: "EN-042",
    student: "Juan Dela Cruz",
    service: "Enrollment",
    wait: "12 min",
    status: "Serving",
  },
  {
    queueNumber: "EN-043",
    student: "Maria Santos",
    service: "Enrollment",
    wait: "5 min",
    status: "Waiting",
  },
  {
    queueNumber: "EN-044",
    student: "Pedro Cruz",
    service: "Enrollment",
    wait: "9 min",
    status: "Waiting",
  },
  {
    queueNumber: "EN-045",
    student: "Ana Reyes",
    service: "Registration",
    wait: "13 min",
    status: "Waiting",
  },
  {
    queueNumber: "EN-046",
    student: "Mark Garcia",
    service: "Document Request",
    wait: "17 min",
    status: "Waiting",
  },
  {
    queueNumber: "EN-047",
    student: "Lisa Mendoza",
    service: "Enrollment",
    wait: "21 min",
    status: "Skipped",
  },
];

function getStatusVariant(status: string) {
  switch (status) {
    case "Serving":
      return "default";

    case "Completed":
      return "secondary";

    case "Skipped":
      return "destructive";

    default:
      return "outline";
  }
}

export function QueueTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Queue List</CardTitle>

            <CardDescription>
              Monitor and manage students currently in the queue.
            </CardDescription>
          </div>

          <Badge variant="secondary">
            {queueData.length} Queue Records
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  Queue #
                </th>

                <th className="px-4 py-3 font-medium">
                  Student
                </th>

                <th className="px-4 py-3 font-medium">
                  Service
                </th>

                <th className="px-4 py-3 font-medium">
                  Waiting Time
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {queueData.map((queue) => (
                <tr
                  key={queue.queueNumber}
                  className="border-b last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-4">
                    <span className="font-semibold">
                      {queue.queueNumber}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <span className="font-medium">
                        {queue.student}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {queue.service}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {queue.wait}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <Badge variant={getStatusVariant(queue.status)}>
                      {queue.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <QueueActions status={queue.status} />
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