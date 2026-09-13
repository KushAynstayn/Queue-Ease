import SystemSettings from "@/components/settings/SystemSettings";
import QueueSettings from "@/components/settings/QueueSettings";
import SMSSettings from "@/components/settings/SMSSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import SaveSettings from "@/components/settings/SaveSettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="text-muted-foreground">
          Configure your Queue Ease system preferences and administrator account.
        </p>
      </div>

      {/* System Settings */}
      <SystemSettings />

      {/* Queue Settings */}
      <QueueSettings />

      {/* SMS Settings */}
      <SMSSettings />

      {/* Account Settings */}
      <AccountSettings />

      {/* Save */}
      <SaveSettings />
    </div>
  );
}