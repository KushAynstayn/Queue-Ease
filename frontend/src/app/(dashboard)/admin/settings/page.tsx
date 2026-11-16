
"use client";

import { useEffect, useState } from "react";

import { apiRequest, ApiRequestError } from "@/lib/api";

import SystemSettings from "@/components/settings/SystemSettings";
import QueueSettings from "@/components/settings/QueueSettings";
import SMSSettings from "@/components/settings/SMSSettings";
import SaveSettings from "@/components/settings/SaveSettings";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface GeneralSettings {
  system_name: string;
  organization_name: string;
  queue_prefix: string;
  academic_year: string;
  estimated_service_minutes: number;
  daily_queue_reset: boolean;
  maximum_queue_capacity: number;
}

interface SmsSettings {
  enabled: boolean;
  queue_confirmation_enabled: boolean;
  queue_update_enabled: boolean;
  now_serving_enabled: boolean;
  service_delay_enabled: boolean;
  alert_threshold_minutes: number;
  sender_name: string | null;
}

const defaultGeneralSettings: GeneralSettings = {
  system_name: "Queue Ease",
  organization_name: "Cebu Technological University",
  queue_prefix: "ENR",
  academic_year: "2026-2027",
  estimated_service_minutes: 15,
  daily_queue_reset: true,
  maximum_queue_capacity: 500,
};

const defaultSmsSettings: SmsSettings = {
  enabled: false,
  queue_confirmation_enabled: false,
  queue_update_enabled: false,
  now_serving_enabled: false,
  service_delay_enabled: false,
  alert_threshold_minutes: 10,
  sender_name: "QueueEase",
};

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] =
    useState<GeneralSettings>(defaultGeneralSettings);

  const [smsSettings, setSmsSettings] =
    useState<SmsSettings>(defaultSmsSettings);

  const [savedGeneralSettings, setSavedGeneralSettings] =
    useState<GeneralSettings>(defaultGeneralSettings);

  const [savedSmsSettings, setSavedSmsSettings] =
    useState<SmsSettings>(defaultSmsSettings);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        setError(null);

        const [generalResponse, smsResponse] = await Promise.all([
          apiRequest<ApiResponse<GeneralSettings>>("/settings"),
          apiRequest<ApiResponse<SmsSettings | null>>("/sms/settings"),
        ]);

        if (!generalResponse.success || !smsResponse.success) {
          throw new Error("Unable to retrieve settings.");
        }

        const generalData = {
          ...defaultGeneralSettings,
          ...generalResponse.data,
        };

        const smsData = {
          ...defaultSmsSettings,
          ...(smsResponse.data ?? {}),
        };

        setGeneralSettings(generalData);
        setSmsSettings(smsData);

        setSavedGeneralSettings(generalData);
        setSavedSmsSettings(smsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load settings."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    const [generalResult, smsResult] = await Promise.allSettled([
      apiRequest<ApiResponse<GeneralSettings>>("/settings", {
        method: "PUT",
        body: JSON.stringify(generalSettings),
      }),

      apiRequest<ApiResponse<SmsSettings>>("/sms/settings", {
        method: "PUT",
        body: JSON.stringify(smsSettings),
      }),
    ]);

    const generalSaved = generalResult.status === "fulfilled";
    const smsSaved = smsResult.status === "fulfilled";

    if (generalSaved) {
      const updatedGeneral = {
        ...generalSettings,
        ...generalResult.value.data,
      };

      setGeneralSettings(updatedGeneral);
      setSavedGeneralSettings(updatedGeneral);
    }

    if (smsSaved) {
      const updatedSms = {
        ...smsSettings,
        ...smsResult.value.data,
      };

      setSmsSettings(updatedSms);
      setSavedSmsSettings(updatedSms);
    }

    if (generalSaved && smsSaved) {
      setSaveMessage("All settings have been saved successfully.");
    } else if (generalSaved || smsSaved) {
      const failedResult = generalSaved ? smsResult : generalResult;

      const failureMessage =
        failedResult.status === "rejected"
          ? failedResult.reason instanceof ApiRequestError
            ? failedResult.reason.message
            : "An unexpected error occurred."
          : "The server returned an unsuccessful response.";

      setSaveError(
        `${generalSaved ? "General settings" : "SMS settings"} saved, but ${
          generalSaved ? "SMS settings" : "general settings"
        } failed to save. ${failureMessage} Please review and save again.`
      );
    } else {
      const generalError =
        generalResult.status === "rejected"
          ? generalResult.reason instanceof Error
            ? generalResult.reason.message
            : "Unknown error."
          : "Unsuccessful response.";

      const smsError =
        smsResult.status === "rejected"
          ? smsResult.reason instanceof Error
            ? smsResult.reason.message
            : "Unknown error."
          : "Unsuccessful response.";

      setSaveError(
        `Unable to save settings. General: ${generalError} SMS: ${smsError}`
      );
    }

    setIsSaving(false);
  }

  function handleCancel() {
    setGeneralSettings(savedGeneralSettings);
    setSmsSettings(savedSmsSettings);

    setSaveMessage(null);
    setSaveError(null);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading system settings...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="ml-2 font-semibold underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="text-muted-foreground">
          Configure your Queue Ease system preferences.
        </p>
      </div>

      <SystemSettings
        settings={generalSettings}
        onChange={setGeneralSettings}
      />

      <QueueSettings
        settings={generalSettings}
        onChange={setGeneralSettings}
      />

      <SMSSettings
        settings={smsSettings}
        onChange={setSmsSettings}
      />

      {saveMessage && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {saveMessage}
        </div>
      )}

      {saveError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {saveError}
        </div>
      )}

      <SaveSettings
        isSaving={isSaving}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
