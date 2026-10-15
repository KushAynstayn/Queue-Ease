"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import UserFilters from "@/components/users/UserFilters";
import UserPagination from "@/components/users/UserPagination";
import UserStats from "@/components/users/UserStats";
import UsersTable from "@/components/users/UsersTable";

import {
  getUsers,
  getUserStats,
  type AdminUser,
  type UserStats as UserStatsData,
  type LaravelPagination,
} from "@/services/users/user.service";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [stats, setStats] =
    useState<UserStatsData>({
      total: 0,
      administrators: 0,
      staff: 0,
      clients: 0,
    });

  const [pagination, setPagination] =
    useState<LaravelPagination<AdminUser> | null>(
      null
    );

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("active");

  const [page, setPage] = useState(1);
  const [perPage] = useState(5);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const loadUsers = useCallback(
    async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getUsers({
          page,
          per_page: perPage,
          search,
          role,
          status,
        });

        setUsers(response.data.data);
        setPagination(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unable to load users.");
        }

        setUsers([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [
      page,
      perPage,
      search,
      role,
      status,
    ]
  );

  const loadStats = useCallback(
    async () => {
      try {
        const response =
          await getUserStats();

        setStats(response.data);
      } catch (error) {
        console.error(
          "Unable to load user statistics:",
          error
        );
      }
    },
    []
  );

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  /**
   * Refresh the users table and statistics
   * after a user is created, updated, activated,
   * deactivated, or deleted.
   */
  const handleUserChanged =
    useCallback(async () => {
      await Promise.all([
        loadUsers(),
        loadStats(),
      ]);
    }, [loadUsers, loadStats]);

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (
    value: string | null
  ) => {
    setRole(value ?? "all");
    setPage(1);
  };

  const handleStatusChange = (
    value: string | null
  ) => {
    setStatus(value ?? "all");
    setPage(1);
  };

  const handlePageChange = (
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Users & Roles
        </h1>

        <p className="text-muted-foreground">
          Manage registered users and assign
          their system roles.
        </p>
      </div>

      {/* Statistics */}
      <UserStats stats={stats} />

      {/* Filters */}
      <UserFilters
        search={search}
        role={role}
        status={status}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onUserCreated={handleUserChanged}
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Users Table */}
      <UsersTable
        users={users}
        isLoading={isLoading}
        onUserChanged={handleUserChanged}
      />

      {/* Pagination */}
      {pagination && (
        <UserPagination
          currentPage={
            pagination.current_page
          }
          lastPage={
            pagination.last_page
          }
          from={pagination.from}
          to={pagination.to}
          total={pagination.total}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}