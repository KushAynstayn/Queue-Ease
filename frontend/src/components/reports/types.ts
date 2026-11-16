export type ReportType = "queue" | "sms" | "forecast";

export interface QueueReportData {
  total_queues: number;
  completed: number;
  waiting: number;
  serving: number;
  skipped: number;
  average_wait_minutes: number;
  average_service_duration_minutes: number;
}

export interface SmsReportData {
  total_sms: number;
  sent: number;
  failed: number;
  pending: number;
}

export interface ForecastItem {
  id: number;
  forecast_date: string;
  service?: {
    id: number;
    name: string;
  } | null;
  service_id: number;
  predicted_transactions: number;
  predicted_wait_minutes: number;
  predicted_peak_hour: number | null;
  model_name: string | null;
  confidence_score: number | null;
}

export interface ForecastReportData {
  data: ForecastItem[];
  total?: number;
}

export type ReportData =
  | QueueReportData
  | SmsReportData
  | ForecastReportData;

export interface ReportApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}