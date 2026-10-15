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

import type { AdminUser } from "@/services/users/user.service";

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onUserChanged: () => Promise<void> | void;
}

function normalizeRole(role: string) {
  const normalized = role.toLowerCase();

  if (
    normalized === "administrator" ||
    normalized === "admin"
  ) {
    return "admin";
  }

  if (normalized === "staff") {
    return "staff";
  }

  return "client";
}

function getRoleIcon(role: string) {
  switch (normalizeRole(role)) {
    case "admin":
      return ShieldCheck;

    case "staff":
      return UserCog;

    default:
      return UserRound;
  }
}

function getRoleLabel(role: string) {
  switch (normalizeRole(role)) {
    case "admin":
      return "Administrator";

    case "staff":
      return "Staff";

    case "client":
      return "Client";

    default:
      return role;
  }
}

function formatDate(date: string | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(date));
}

function formatLastLogin(date: string | null) {
  if (!date) {
    return "Never";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

export default function UsersTable({
  users,
  isLoading,
  onUserChanged,
}: UsersTableProps) {
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const roleName =
                  user.role?.name ?? "client";

                const roleLabel =
                  getRoleLabel(roleName);

                const Icon =
                  getRoleIcon(roleName);

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                          <p className="font-medium">
                            {user.first_name}{" "}

                            {user.middle_name
                              ? `${user.middle_name} `
                              : ""}

                            {user.last_name}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <RoleBadge
                        role={roleLabel}
                      />
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={user.status}
                      />
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        user.created_at
                      )}
                    </TableCell>

                    <TableCell>
                      {formatLastLogin(
                        user.last_login_at
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <UserActions
                        user={user}
                        onUserChanged={
                          onUserChanged
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}