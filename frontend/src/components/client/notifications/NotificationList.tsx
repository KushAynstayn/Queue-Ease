"use client";

import {
  BellRing,
  CheckCircle2,
  Clock3,
  Info,
  MessageSquareText,
  Search,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  date: string;
  time: string;
  status: "Delivered" | "Pending" | "Failed";
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "Queue Update",
    title: "Queue position updated",
    message:
      "Your queue number A-024 is now 5th in line.",
    date: "Today",
    time: "10:42 AM",
    status: "Delivered",
  },
  {
    id: 2,
    type: "Estimated Wait",
    title: "Estimated waiting time updated",
    message:
      "Your estimated waiting time is approximately 15 minutes.",
    date: "Today",
    time: "10:35 AM",
    status: "Delivered",
  },
  {
    id: 3,
    type: "Queue Confirmation",
    title: "Queue request confirmed",
    message:
      "Your enrollment queue number A-024 has been successfully created.",
    date: "Today",
    time: "10:20 AM",
    status: "Delivered",
  },
  {
    id: 4,
    type: "Now Serving",
    title: "Queue is moving",
    message:
      "The enrollment office is currently serving queue number A-019.",
    date: "Today",
    time: "10:10 AM",
    status: "Delivered",
  },
  {
    id: 5,
    type: "Service Update",
    title: "Enrollment service available",
    message:
      "The enrollment service is currently accepting queue requests.",
    date: "Yesterday",
    time: "8:15 AM",
    status: "Delivered",
  },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case "Queue Update":
      return <BellRing className="h-4 w-4" />;

    case "Estimated Wait":
      return <Clock3 className="h-4 w-4" />;

    case "Queue Confirmation":
      return <CheckCircle2 className="h-4 w-4" />;

    case "Now Serving":
      return <MessageSquareText className="h-4 w-4" />;

    case "Service Update":
      return <Info className="h-4 w-4" />;

    default:
      return <BellRing className="h-4 w-4" />;
  }
}

function getStatusStyles(status: Notification["status"]) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";

    case "Pending":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";

    case "Failed":
      return "bg-red-100 text-red-700 hover:bg-red-100";

    default:
      return "";
  }
}

export default function NotificationList() {
  const [search, setSearch] = useState("");

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return notifications;
    }

    return notifications.filter((notification) => {
      return (
        notification.type.toLowerCase().includes(query) ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-base">
            Notification History
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Review your previous queue-related SMS notifications.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notifications..."
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent>
        {filteredNotifications.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <TriangleAlert className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-medium">
              No notifications found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try another search term.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex gap-4 py-5 first:pt-0 last:pb-0"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2845D6]/10 text-[#2845D6]">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">
                          {notification.title}
                        </h3>

                        <Badge
                          variant="secondary"
                          className={getStatusStyles(
                            notification.status
                          )}
                        >
                          {notification.status}
                        </Badge>
                      </div>

                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {notification.type}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3 w-3" />

                      <span>
                        {notification.date} · {notification.time}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}