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

import UserActions from "./UserActions";

import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";

const users = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@queueease.com",
    role: "Administrator",
    status: "Active",
    created: "Jul 2, 2026",
    lastLogin: "5 mins ago",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@queueease.com",
    role: "Staff",
    status: "Active",
    created: "Jul 4, 2026",
    lastLogin: "1 hour ago",
  },
  {
    id: 3,
    name: "Peter Reyes",
    email: "peter@gmail.com",
    role: "Client",
    status: "Active",
    created: "Jul 8, 2026",
    lastLogin: "Yesterday",
  },
  {
    id: 4,
    name: "Ana Cruz",
    email: "ana@gmail.com",
    role: "Client",
    status: "Inactive",
    created: "Jul 10, 2026",
    lastLogin: "Never",
  },
  {
    id: 5,
    name: "Michael Ramos",
    email: "michael@gmail.com",
    role: "Staff",
    status: "Active",
    created: "Jul 12, 2026",
    lastLogin: "2 hours ago",
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

export default function UsersTable() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>

          <TableHeader>

            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[70px] text-right">
                Actions
              </TableHead>
            </TableRow>

          </TableHeader>

          <TableBody>

            {users.map((user) => {
              const Icon = getRoleIcon(user.role);

              return (
                <TableRow key={user.id}>

                  <TableCell>

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <div>

                        <p className="font-medium">
                          {user.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>

                      </div>

                    </div>

                  </TableCell>

                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>

                  <TableCell>{user.created}</TableCell>

                  <TableCell>{user.lastLogin}</TableCell>

                  <TableCell className="text-right">
                    <UserActions
                        status={user.status}
                    />
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