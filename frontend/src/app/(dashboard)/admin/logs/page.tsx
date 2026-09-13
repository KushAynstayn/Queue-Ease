import ActivityFilters from "@/components/activity/ActivityFilters";
import ActivityPagination from "@/components/activity/ActivityPagination";
import ActivityStats from "@/components/activity/ActivityStats";
import ActivityTable from "@/components/activity/ActivityTable";

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Activity Logs
        </h1>

        <p className="text-muted-foreground">
          Monitor user activities and important system events for auditing and security.
        </p>
      </div>

      {/* Statistics */}
      <ActivityStats />

      {/* Filters */}
      <ActivityFilters />

      {/* Activity Table */}
      <ActivityTable />

      {/* Pagination */}
      <ActivityPagination />
    </div>
  );
}