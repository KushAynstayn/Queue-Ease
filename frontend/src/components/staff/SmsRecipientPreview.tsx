import {
  CheckCircle2,
  Clock3,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const recipients = [
  {
    name: "Maria Santos",
    queue: "EN-043",
    status: "Waiting",
  },
  {
    name: "Pedro Cruz",
    queue: "EN-044",
    status: "Waiting",
  },
  {
    name: "Ana Reyes",
    queue: "EN-045",
    status: "Waiting",
  },
  {
    name: "Mark Garcia",
    queue: "EN-046",
    status: "Waiting",
  },
];

export function SmsRecipientPreview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Recipient Preview</CardTitle>

            <CardDescription>
              Clients currently selected for notification.
            </CardDescription>
          </div>

          <UsersRound className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {recipients.map((recipient) => (
            <div
              key={recipient.queue}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <UsersRound className="h-4 w-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {recipient.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {recipient.queue}
                  </p>
                </div>
              </div>

              <Badge variant="outline">
                <Clock3 className="mr-1 h-3 w-3" />
                {recipient.status}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 shrink-0" />

          <span>
            Recipient phone numbers will be retrieved securely
            from the client queue records.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}