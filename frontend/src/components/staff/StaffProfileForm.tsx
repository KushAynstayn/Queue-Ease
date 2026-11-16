
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CircleUserRound,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiRequestError } from "@/lib/api";

interface AssignedCounter {
  id: number;
  name: string;
  counter_number: string;
  status: string;
  service: string | null;
}

interface StaffProfile {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  display_name: string;
  username: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  assigned_counters: AssignedCounter[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function StaffProfileForm() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<ApiResponse<StaffProfile>>(
        "/staff/profile"
      );

      setProfile(response.data);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Unable to retrieve your staff profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-48 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading staff profile...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card>
        <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />

          <div>
            <p className="font-medium">Unable to load profile</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error || "Staff profile information is unavailable."}
            </p>
          </div>

          <Button variant="outline" onClick={fetchProfile}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CircleUserRound className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View your staff account information. Profile changes
                are managed by the system administrator.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Display Name</p>
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                {profile.display_name || "Not provided"}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Email Address</p>
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                {profile.email}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Username</p>
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                {profile.username}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Phone Number</p>
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                {profile.phone || "Not provided"}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Role</p>
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                {profile.role}
              </div>
              <p className="text-xs text-muted-foreground">
                Your role is managed by the system administrator.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Account Status</p>
              <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    profile.status === "active"
                      ? "bg-emerald-500"
                      : "bg-destructive"
                  }`}
                />
                <span className="capitalize">{profile.status}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Counter</CardTitle>
          <CardDescription>
            Service counter assignments managed by the system administrator.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {profile.assigned_counters.length > 0 ? (
            <div className="space-y-3">
              {profile.assigned_counters.map((counter) => (
                <div
                  key={counter.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{counter.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {counter.counter_number}
                      {counter.service
                        ? ` · ${counter.service}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        counter.status === "open"
                          ? "bg-emerald-500"
                          : counter.status === "maintenance"
                            ? "bg-amber-500"
                            : "bg-muted-foreground"
                      }`}
                    />
                    <span className="text-sm capitalize text-muted-foreground">
                      {counter.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm font-medium">
                No assigned counter
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Contact the system administrator if you need a counter assignment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-4 w-4" />
          Profile information is managed securely.
        </div>

        <Button variant="outline" onClick={fetchProfile}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
