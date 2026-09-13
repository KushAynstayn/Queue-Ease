"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserForm() {
  return (
    <form className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>

          <Input
            id="firstName"
            placeholder="Juan"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>

          <Input
            id="lastName"
            placeholder="Dela Cruz"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>

        <Input
          id="email"
          type="email"
          placeholder="juan@queueease.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>

        <Input
          id="phone"
          placeholder="+63 912 345 6789"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>

          <Input
            id="username"
            placeholder="juan.delacruz"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Role</Label>

          <Select defaultValue="client">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="administrator">
                Administrator
              </SelectItem>

              <SelectItem value="staff">
                Staff
              </SelectItem>

              <SelectItem value="client">
                Client
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <Select defaultValue="active">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">
                Active
              </SelectItem>

              <SelectItem value="inactive">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
        >
          Cancel
        </Button>

        <Button type="submit">
          Save User
        </Button>
      </div>
    </form>
  );
}