// Placeholder for user service integration.
import { apiRequest } from "@/lib/api";

export interface UserRole {
  id: number;
  name: string;
  description: string | null;
}

export interface AdminUser {
  id: number;
  role_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  role: UserRole;
}

export interface UserStats {
  total: number;
  administrators: number;
  staff: number;
  clients: number;
}

export interface UserListParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface LaravelPagination<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: LaravelPagination<AdminUser>;
}

export interface UserStatsResponse {
  success: boolean;
  message: string;
  data: UserStats;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

export interface CreateUserPayload {
  role_id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  status?: "active" | "inactive" | "suspended";
}

export interface UpdateUserPayload {
  role_id?: number;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
}

export interface UpdateUserStatusPayload {
  status: "active" | "inactive" | "suspended";
}

export interface ResetPasswordPayload {
  password: string;
  password_confirmation: string;
}

/**
 * Retrieve paginated users.
 */
export async function getUsers(
  params: UserListParams = {}
): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.per_page !== undefined) {
    searchParams.set("per_page", String(params.per_page));
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.role && params.role !== "all") {
    searchParams.set("role", params.role);
  }

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  const queryString = searchParams.toString();

  return apiRequest<UsersResponse>(
    `/users${queryString ? `?${queryString}` : ""}`
  );
}

/**
 * Retrieve user statistics.
 */
export async function getUserStats(): Promise<UserStatsResponse> {
  return apiRequest<UserStatsResponse>("/users/stats");
}

/**
 * Retrieve one user.
 */
export async function getUser(
  id: number
): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/users/${id}`);
}

/**
 * Create a user.
 */
export async function createUser(
  payload: CreateUserPayload
): Promise<UserResponse> {
  return apiRequest<UserResponse>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a user.
 */
export async function updateUser(
  id: number,
  payload: UpdateUserPayload
): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Update user status.
 */
export async function updateUserStatus(
  id: number,
  payload: UpdateUserStatusPayload
): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Reset user password.
 */
export async function resetUserPassword(
  id: number,
  payload: ResetPasswordPayload
): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(`/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a user.
 */
export async function deleteUser(
  id: number
): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(`/users/${id}`, {
    method: "DELETE",
  });
}