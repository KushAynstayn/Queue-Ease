import QueueHeader from "@/components/queue/QueueHeader";
import QueueStats from "@/components/queue/QueueStats";
import QueueFilters from "@/components/queue/QueueFilters";
import QueueTable from "@/components/queue/QueueTable";
import QueuePagination from "@/components/queue/QueuePagination";

export default function QueuePage() {
  return (
    <div className="space-y-8">
      <QueueHeader />

      <QueueStats />

      <QueueFilters />

      <QueueTable />

      <QueuePagination />
    </div>
  );
}