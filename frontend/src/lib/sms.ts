
import { apiRequest } from "@/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SmsSummaryData {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
}

export interface SmsSettingsData {
  id: number;
  enabled: boolean;
  queue_confirmation_enabled: boolean;
  queue_update_enabled: boolean;
  now_serving_enabled: boolean;
  service_delay_enabled: boolean;
  alert_threshold_minutes: number;
  sender_name: string | null;
  updated_by: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SmsSettingsPayload {
  enabled: boolean;
  queue_confirmation_enabled: boolean;
  queue_update_enabled: boolean;
  now_serving_enabled: boolean;
  service_delay_enabled: boolean;
  alert_threshold_minutes: number;
  sender_name: string | null;
}

export interface SmsNotification {
  id: number;
  user_id: number | null;
  queue_transaction_id: number | null;
  recipient_number: string;
  message_type: string;
  message: string;
  status: "pending" | "sent" | "delivered" | "failed";
  provider: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export async function getSmsSummary() {
  return apiRequest<ApiResponse<SmsSummaryData>>(
    "/sms/summary"
  );
}

export async function getSmsNotifications(page = 1) {
  return apiRequest<ApiResponse<PaginatedData<SmsNotification>>>(
    `/sms/notifications?per_page=15&page=${page}`
  );
}

export async function getSmsSettings() {
  return apiRequest<ApiResponse<SmsSettingsData | null>>(
    "/sms/settings"
  );
}

export async function updateSmsSettings(
  payload: SmsSettingsPayload
) {
  return apiRequest<ApiResponse<SmsSettingsData>>(
    "/sms/settings",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}
