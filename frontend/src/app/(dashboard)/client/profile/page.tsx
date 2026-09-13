"use client";

import {
  AtSign,
  GraduationCap,
  IdCard,
  Phone,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-[#2845D6]" />

          <span className="text-sm font-medium text-muted-foreground">
            Account
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your student account information.
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Student Information
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Your registered student information.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name
            </Label>

            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="name"
                defaultValue="Juan Dela Cruz"
                className="pl-9"
              />
            </div>
          </div>

          {/* Student ID */}
          <div className="space-y-2">
            <Label htmlFor="student-id">
              Student ID
            </Label>

            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="student-id"
                defaultValue="2024-00123"
                disabled
                className="pl-9"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address
            </Label>

            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                defaultValue="juan.delacruz@student.edu.ph"
                className="pl-9"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <Label htmlFor="mobile">
              Mobile Number
            </Label>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="mobile"
                type="tel"
                defaultValue="09171234567"
                className="pl-9"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              This number will be used for your queue SMS notifications.
            </p>
          </div>

          {/* Program */}
          <div className="space-y-2">
            <Label htmlFor="program">
              Program
            </Label>

            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="program"
                defaultValue="BS Information Technology"
                className="pl-9"
              />
            </div>
          </div>

          {/* Year Level */}
          <div className="space-y-2">
            <Label htmlFor="year-level">
              Year Level
            </Label>

            <Input
              id="year-level"
              defaultValue="3rd Year"
              className="max-w-xs"
            />
          </div>

          {/* Save */}
          <div className="flex justify-end border-t pt-6">
            <Button
              type="button"
              className="bg-[#2845D6] hover:bg-[#2845D6]/90"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}