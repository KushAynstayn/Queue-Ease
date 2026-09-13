import UserFilters from "@/components/users/UserFilters";
import UserPagination from "@/components/users/UserPagination";
import UserStats from "@/components/users/UserStats";
import UsersTable from "@/components/users/UsersTable";


export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Users & Roles
        </h1>

        <p className="text-muted-foreground">
          Manage registered users and assign their system roles.
        </p>
      </div>

      {/* Statistics */}
      <UserStats />

      {/* Filters */}
      <UserFilters />

      {/* Users Table */}
      <UsersTable />

      {/* Pagination */}
      <UserPagination />
    </div>
  );
}