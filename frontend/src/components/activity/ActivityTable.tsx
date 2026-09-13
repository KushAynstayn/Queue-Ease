"use client";

import {
  ShieldCheck,
  UserCog,
  UserRound,
} from "lucide-react";

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
import StatusBadge from "./StatusBadge";
import ActivityActions from "./ActivityActions";

const activities = [
  {
    id: 1,
    user: "Juan Dela Cruz",
    role: "Administrator",
    action: "Login",
    module: "Authentication",
    datetime: "Aug 6, 2026 • 9:00 AM",
    status: "Success",
  },
  {
    id: 2,
    user: "Maria Santos",
    role: "Staff",
    action: "Update",
    module: "Queue Monitoring",
    datetime: "Aug 6, 2026 • 9:15 AM",
    status: "Success",
  },
  {
    id: 3,
    user: "Peter Reyes",
    role: "Client",
    action: "Create",
    module: "Queue",
    datetime: "Aug 6, 2026 • 9:22 AM",
    status: "Success",
  },
  {
    id: 4,
    user: "Ana Cruz",
    role: "Client",
    action: "Login",
    module: "Authentication",
    datetime: "Aug 6, 2026 • 9:30 AM",
    status: "Failed",
  },
  {
    id: 5,
    user: "Michael Ramos",
    role: "Staff",
    action: "SMS",
    module: "SMS Notifications",
    datetime: "Aug 6, 2026 • 9:45 AM",
    status: "Success",
  },
  {
    id: 6,
    user: "System Administrator",
    role: "Administrator",
    action: "Delete",
    module: "Users & Roles",
    datetime: "Aug 6, 2026 • 10:10 AM",
    status: "Warning",
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Administrator":
      return ShieldCheck;

    case "Staff":
      return UserCog;

    default:
      return UserRound;
  }
};

export default function ActivityTable() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {activities.map((activity) => {
              const Icon = getRoleIcon(activity.role);

              return (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <span className="font-medium">
                        {activity.user}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {activity.role}
                  </TableCell>

                  <TableCell>
                    <ActionBadge action={activity.action} />
                  </TableCell>

                  <TableCell>
                    {activity.module}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {activity.datetime}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={activity.status} />
                  </TableCell>

                  <TableCell className="text-right">
                    <ActivityActions />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}