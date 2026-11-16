
"use client";

import { useState } from "react";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  LoaderCircle,
} from "lucide-react";
import {
  updateQueueStatus,
  type QueueRecord,
  type QueueStatus,
} from "@/services/admin/queue.service";

interface QueueTableProps {
  queues: QueueRecord[];
  loading: boolean;
  onStatusUpdated: () => void;
}

function statusLabel(status: QueueStatus) {
  const labels: Record<QueueStatus, string> = {
    waiting: "Waiting",
    called: "Called",
    serving: "Serving",
    completed: "Completed",
    skipped: "Skipped",
    cancelled: "Cancelled",
    no_show: "No Show",
  };

  return labels[status];
}

function statusBadge(status: QueueStatus) {
  switch (status) {
    case "waiting":
      return "bg-amber-100 text-amber-700";
    case "called":
    case "serving":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
    case "no_show":
      return "bg-red-100 text-red-700";
    case "skipped":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatEta(queue: QueueRecord) {
  if (
    !queue.requested_at ||
    queue.estimated_wait_minutes === null ||
    ["completed", "cancelled", "skipped", "no_show"].includes(queue.status)
  ) {
    return "—";
  }

  const requested = new Date(queue.requested_at);
  if (Number.isNaN(requested.getTime())) return "—";

  const eta = new Date(
    requested.getTime() + queue.estimated_wait_minutes * 60_000
  );

  return eta.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatWaiting(minutes: number | null) {
  if (minutes === null || minutes === undefined) return "—";
  return `${minutes} min${minutes === 1 ? "" : "s"}`;
}

export default function QueueTable({
  queues,
  loading,
  onStatusUpdated,
}: QueueTableProps) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");

  async function changeStatus(queue: QueueRecord, status: QueueStatus) {
    const confirmed = window.confirm(
      `Change queue ${queue.queue_number} to "${statusLabel(status)}"?`
    );

    if (!confirmed) return;

    setBusyId(queue.id);
    setActionError("");

    try {
      await updateQueueStatus(queue.id, status);
      onStatusUpdated();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to update queue."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Queue List
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor queue records and manage permitted status changes.
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2845D6]">
          {queues.length} Records on Page
        </div>
      </div>

      {actionError && (
        <p role="alert" className="border-b border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">Queue No.</th>
              <th className="px-6 py-4">Student No.</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Counter</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Wait (min)</th>
              <th className="px-6 py-4">ETA</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle size={18} className="animate-spin" />
                    Loading queue records...
                  </span>
                </td>
              </tr>
            ) : queues.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                  No queue records match the selected filters.
                </td>
              </tr>
            ) : (
              queues.map((queue) => {
                const busy = busyId === queue.id;
                const canComplete = ["called", "serving"].includes(queue.status);
                const canCancel = ![
                  "completed",
                  "cancelled",
                  "no_show",
                ].includes(queue.status);

                return (
                  <tr
                    key={queue.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-6 py-5 font-semibold text-[#2845D6]">
                      {queue.queue_number}
                    </td>
                    <td className="px-6 py-5">
                      {queue.student_number || `Client #${queue.client_id}`}
                    </td>
                    <td className="px-6 py-5">{queue.service_name || "—"}</td>
                    <td className="px-6 py-5">
                      {queue.counter_name ||
                        (queue.counter_number
                          ? `Counter ${queue.counter_number}`
                          : "Unassigned")}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          queue.priority === "priority"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {queue.priority === "priority" ? "Priority" : "Regular"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(queue.status)}`}
                      >
                        {statusLabel(queue.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Clock3 size={16} className="text-slate-400" />
                        {formatWaiting(queue.estimated_wait_minutes)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      {formatEta(queue)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          title="View queue details"
                          aria-label={`View ${queue.queue_number}`}
                          onClick={() =>
                            window.alert(
                              [
                                `Queue: ${queue.queue_number}`,
                                `Service: ${queue.service_name || "—"}`,
                                `Status: ${statusLabel(queue.status)}`,
                                `Requested: ${queue.requested_at || "—"}`,
                              ].join("\n")
                            )
                          }
                          className="rounded-lg bg-slate-100 p-2 transition hover:bg-slate-200"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          type="button"
                          title="Complete queue"
                          aria-label={`Complete ${queue.queue_number}`}
                          disabled={busy || !canComplete}
                          onClick={() => changeStatus(queue, "completed")}
                          className="rounded-lg bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {busy ? (
                            <LoaderCircle size={18} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={18} />
                          )}
                        </button>

                        <button
                          type="button"
                          title="Cancel queue"
                          aria-label={`Cancel ${queue.queue_number}`}
                          disabled={busy || !canCancel}
                          onClick={() => changeStatus(queue, "cancelled")}
                          className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
