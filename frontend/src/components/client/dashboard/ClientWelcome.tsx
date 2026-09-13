"use client";

import { UserRound } from "lucide-react";

interface ClientWelcomeProps {
  name?: string;
}

export default function ClientWelcome({
  name = "Student",
}: ClientWelcomeProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5 text-[#2845D6]" />

        <span className="text-sm font-medium text-muted-foreground">
          Client Dashboard
        </span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome back, {name}!
      </h1>

      <p className="text-sm text-muted-foreground">
        Monitor your queue and stay updated with your service status.
      </p>
    </div>
  );
}