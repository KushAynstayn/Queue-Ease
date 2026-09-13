import { BellRing } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { SmsComposer } from "@/components/staff/SmsComposer";
import { SmsRecipientPreview } from "@/components/staff/SmsRecipientPreview";
import { SmsStatusCard } from "@/components/staff/SmsStatusCard";
import { SmsLogs } from "@/components/staff/SmsLogs";

export default function StaffSmsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            SMS Notifications
          </h1>

          <Badge variant="secondary">
            Staff
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Send and monitor queue-related SMS notifications.
        </p>
      </div>

      {/* Composer + Status */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SmsComposer />

          <SmsRecipientPreview />
        </div>

        <div>
          <SmsStatusCard />
        </div>
      </div>

      {/* Recent Logs */}
      <SmsLogs />
    </div>
  );
}