
import { apiRequest } from "@/lib/api";

export type QueueStatus =
  | "waiting"
  | "called"
  | "serving"
  | "completed"
  | "skipped"
  | "cancelled"
  | "no_show";

export interface QueueRecord {
  id: number;
  client_id: number;
  service_id: number;
  counter_id: number | null;
  queue_number: string;
  queue_date: string;
  status: QueueStatus;
  priority: "normal" | "priority";
  position_number: number;
  estimated_wait_minutes: number | null;
  actual_wait_minutes: number | null;
  requested_at: string | null;
  called_at: string | null;
  serving_at: string | null;
  completed_at: string | null;
  student_number: string | null;
  service_name: string | null;
  service_code: string | null;
  counter_number: string | number | null;
  counter_name: string | null;
  created_at: string;
  updated_at: string;
}

interface LaravelPaginator<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface QueueFilters {
  search?: string;
  status?: string;
  service_id?: string;
  queue_date?: string;
  page?: number;
  per_page?: number;
}

export interface QueuePageData {
  records: QueueRecord[];
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  from: number | null;
  to: number | null;
}

export async function getQueues(
  filters: QueueFilters = {}
): Promise<QueuePageData> {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.status) params.set("status", filters.status);
  if (filters.service_id) params.set("service_id", filters.service_id);
  if (filters.queue_date) params.set("queue_date", filters.queue_date);

  params.set("page", String(filters.page ?? 1));
  params.set("per_page", String(filters.per_page ?? 10));

  const response = await apiRequest<ApiResponse<LaravelPaginator<QueueRecord>>>(
    `/queues?${params.toString()}`
  );

  const page = response.data;

  return {
    records: page.data,
    currentPage: page.current_page,
    totalPages: page.last_page,
    perPage: page.per_page,
    totalItems: page.total,
    from: page.from,
    to: page.to,
  };
}

export async function updateQueueStatus(
  id: number,
  status: QueueStatus,
  notes?: string
): Promise<QueueRecord> {
  const response = await apiRequest<ApiResponse<QueueRecord>>(
    `/queues/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    }
  );

  return response.data;
}
