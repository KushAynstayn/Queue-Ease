
export interface AnalyticsSummaryData {
  clients_served: number;
  average_wait_minutes: number | null;
  completion_rate: number;
  total_queues: number;
}

export interface QueueTrendData {
  date: string;
  total: number;
}

export interface ServiceDistributionData {
  service_id: number;
  service_name: string;
  total: number;
  percentage: number;
}

export interface ServicePerformanceData {
  service_id: number;
  service_name: string;
  total_queues: number;
  completed_queues: number;
  average_wait_minutes: number | null;
  completion_rate: number;
}

export interface AnalyticsFiltersData {
  start_date: string;
  end_date: string;
  service_id: number | null;
}

export interface AnalyticsData {
  summary: AnalyticsSummaryData;
  queue_trend: QueueTrendData[];
  service_distribution: ServiceDistributionData[];
  service_performance: ServicePerformanceData[];
  filters: AnalyticsFiltersData;
}

export interface AnalyticsApiResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
}
