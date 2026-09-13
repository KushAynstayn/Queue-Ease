import { UserRound } from "lucide-react";

import { StaffProfileForm } from "@/components/staff/StaffProfileForm";

export default function StaffProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-muted-foreground" />

          <h1 className="text-2xl font-semibold tracking-tight">
            Staff Profile
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile information and staff preferences.
        </p>
      </div>

      <StaffProfileForm />
    </div>
  );
}