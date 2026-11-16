
export type QueueStatus =
  | "waiting"
  | "called"
  | "serving"
  | "completed"
  | "skipped"
  | "cancelled"
  | "no_show";

export type QueueItem = {
  id: number;
  queue_number: string;
  queue_date: string;
  status: QueueStatus;
  priority: "normal" | "priority";
  position_number: number | null;
  estimated_wait_minutes: number | null;
  counter_id: number | null;
  service_id: number;
  student_number: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  service_name: string | null;
  counter_name: string | null;
  counter_number: string | null;
};

export type QueueFiltersValue = {
  search: string;
  status: QueueStatus | "all" | null;
  serviceId: string | null;
};

export type QueueService = {
  id: number;
  name: string;
};
