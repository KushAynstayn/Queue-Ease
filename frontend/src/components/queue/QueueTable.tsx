"use client";

import {
  Eye,
  Pencil,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

const queues = [
  {
    id: "A001",
    client: "Juan Dela Cruz",
    service: "Registrar",
    counter: "Counter 1",
    priority: "Regular",
    status: "Waiting",
    waiting: "12 mins",
    estimate: "10:45 AM",
  },
  {
    id: "A002",
    client: "Maria Santos",
    service: "Cashier",
    counter: "Counter 2",
    priority: "Priority",
    status: "Serving",
    waiting: "5 mins",
    estimate: "10:35 AM",
  },
  {
    id: "A003",
    client: "John Reyes",
    service: "Admission",
    counter: "Counter 3",
    priority: "Regular",
    status: "Completed",
    waiting: "-",
    estimate: "-",
  },
  {
    id: "A004",
    client: "Angela Cruz",
    service: "Guidance",
    counter: "Counter 4",
    priority: "PWD",
    status: "Waiting",
    waiting: "18 mins",
    estimate: "11:05 AM",
  },
];

function statusBadge(status: string) {
  switch (status) {
    case "Waiting":
      return "bg-amber-100 text-amber-700";

    case "Serving":
      return "bg-blue-100 text-blue-700";

    case "Completed":
      return "bg-emerald-100 text-emerald-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function priorityBadge(priority: string) {
  switch (priority) {
    case "Priority":
      return "bg-violet-100 text-violet-700";

    case "PWD":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function QueueTable() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Active Queue List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage all queue records and monitor client progress.
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2845D6]">
          {queues.length} Active Queues
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">Queue No.</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Counter</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Waiting</th>
              <th className="px-6 py-4">ETA</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {queues.map((queue) => (
              <tr
                key={queue.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-5 font-semibold text-[#2845D6]">
                  {queue.id}
                </td>

                <td className="px-6 py-5">{queue.client}</td>

                <td className="px-6 py-5">{queue.service}</td>

                <td className="px-6 py-5">{queue.counter}</td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
                      queue.priority
                    )}`}
                  >
                    {queue.priority}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      queue.status
                    )}`}
                  >
                    {queue.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-slate-400" />
                    {queue.waiting}
                  </div>
                </td>

                <td className="px-6 py-5">{queue.estimate}</td>

                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    <button
                      className="rounded-lg bg-slate-100 p-2 transition hover:bg-slate-200"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="rounded-lg bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200"
                      title="Complete"
                    >
                      <CheckCircle2 size={18} />
                    </button>

                    <button
                      className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                      title="Cancel"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}