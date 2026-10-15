import { apiRequest } from "@/lib/api";

export interface AdminDashboardData {
  date: string;

  users: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };

  queue: {
    waiting: number;
    called: number;
    serving: number;
    completed: number;
    cancelled: number;
  };

  services: {
    active: number;
    inactive: number;
  };

  sms: {
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
  };

  latest_forecast: unknown | null;

  recent_activities: unknown[];
}

interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboardData;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const response = await apiRequest<AdminDashboardResponse>(
    "/admin/dashboard"
  );

  return response.data;
}