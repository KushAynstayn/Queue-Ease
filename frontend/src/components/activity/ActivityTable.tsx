
"use client";

import { Activity, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ActionBadge from "./ActionBadge";
import type { ActivityLog } from "@/app/(dashboard)/admin/logs/page";

interface ActivityTableProps {
  activities: ActivityLog[];
  loading: boolean;
}

function getUserName(user: ActivityLog["user"]) {
  if (!user) {
    return "Deleted / Unknown User";
  }

  return [
    user.first_name,
    user.middle_name,
    user.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatDateTime(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ActivityTable({
  activities,
  loading,
}: ActivityTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="whitespace-nowrap">
                Date & Time
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading activity logs...
                  </div>
                </TableCell>
              </TableRow>
            ) : activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Activity className="h-6 w-6" />
                    No activity logs found.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{getUserName(activity.user)}</p>
                      {activity.user?.username && (
                        <p className="text-xs text-muted-foreground">
                          @{activity.user.username}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <ActionBadge action={activity.action} />
                  </TableCell>

                  <TableCell>
                    {activity.module || "—"}
                  </TableCell>

                  <TableCell className="max-w-[320px]">
                    <p
                      className="truncate text-sm"
                      title={activity.description || ""}
                    >
                      {activity.description || "—"}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-sm">
                    {formatDateTime(activity.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
