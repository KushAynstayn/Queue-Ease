"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>

        <CardDescription>
          Update your administrator account information and password.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name
            </Label>

            <Input
              id="fullName"
              defaultValue="System Administrator"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address
            </Label>

            <Input
              id="email"
              type="email"
              defaultValue="admin@queueease.com"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="border-t pt-6">
          <h3 className="mb-4 text-base font-semibold">
            Change Password
          </h3>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                Current Password
              </Label>

              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New Password
                </Label>

                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password
                </Label>

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}