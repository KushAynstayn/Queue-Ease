
"use client";

import { useEffect, useState } from "react";
import {
  AtSign,
  IdCard,
  Phone,
  UserCircle,
  RefreshCw,
} from "lucide-react";

import { apiRequest, ApiRequestError } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ClientProfile {
  id: number;
  client_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  student_number: string | null;
  email: string;
  phone: string | null;
  program: string | null;
  year_level: string | null;
}

export default function Page() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProfile() {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest<ApiResponse<ClientProfile>>(
        "/client/profile"
      );

      setProfile(response.data);
      setPhone(response.data.phone ?? "");
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Unable to retrieve your profile."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest<
        ApiResponse<{ phone: string }>
      >("/client/profile", {
        method: "PUT",
        body: JSON.stringify({ phone: phone.trim() }),
      });

      setPhone(response.data.phone);

      setProfile((current) =>
        current
          ? { ...current, phone: response.data.phone }
          : current
      );

      setSuccess(response.message);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                Student Information
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Your registered student information.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadProfile()}
              disabled={isLoading || isSaving}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading your profile...
              </p>
            </div>
          ) : error && !profile ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-destructive">
                Unable to load your profile
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => void loadProfile()}
              >
                Try Again
              </Button>
            </div>
          ) : profile ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="name"
                    value={profile.full_name}
                    disabled
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>

                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="student-id"
                    value={profile.student_number ?? "Not available"}
                    disabled
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="mobile"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter your mobile number"
                    className="pl-9"
                    required
                    maxLength={20}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  This number will be used for your queue SMS notifications.
                </p>
              </div>

              {/* Feedback */}
              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-sm text-emerald-700">{success}</p>
                </div>
              )}

              {/* Save */}
              <div className="flex justify-end border-t pt-6">
                <Button
                  type="submit"
                  disabled={isSaving || !phone.trim()}
                  className="bg-[#2845D6] hover:bg-[#2845D6]/90"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
