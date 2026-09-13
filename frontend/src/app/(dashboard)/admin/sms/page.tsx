import SmsSummary from "@/components/sms/SmsSummary";
import SmsGatewayStatus from "@/components/sms/SmsGatewayStatus";
import SmsSettings from "@/components/sms/SmsSettings";
import SmsTemplates from "@/components/sms/SmsTemplates";
import SmsLogsTable from "@/components/sms/SmsLogsTable";

export default function SmsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          SMS Notifications
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor SMS activity, manage notification settings, and review
          message delivery for queue updates and enrollment notifications.
        </p>
      </div>

      {/* Summary */}
      <SmsSummary />

      {/* Gateway + Settings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SmsGatewayStatus />
        <SmsSettings />
      </div>

      {/* Templates */}
      <SmsTemplates />

      {/* SMS Logs */}
      <SmsLogsTable />
    </div>
  );
}