
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ForecastResult {
  id: number;
  service_id: number;
  forecast_date: string;
  predicted_transactions: number | null;
  predicted_wait_minutes: number | null;
  predicted_peak_hour: string | null;
  model_name: string | null;
  model_version: string | null;
  confidence_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface ForecastingData {
  id: number;
  service_id: number;
  forecast_date: string;
  day_of_week: string | null;
  total_transactions: number | null;
  completed_transactions: number | null;
  average_wait_minutes: number | null;
  average_service_minutes: number | null;
  peak_hour: string | null;
  created_at: string;
  updated_at: string;
}
