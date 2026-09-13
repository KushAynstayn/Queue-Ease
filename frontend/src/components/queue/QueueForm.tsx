"use client";

export type QueueFormMode = "create" | "edit" | "view";

export interface QueueFormValues {
  queueNumber?: string;
  clientName?: string;
  service?: string;
  counter?: string;
  priority?: string;
  mobile?: string;
  status?: string;
  sms?: string;
  remarks?: string;
}

interface QueueFormProps {
  mode: QueueFormMode;
  defaultValues?: QueueFormValues;
}

export default function QueueForm({
  mode,
  defaultValues = {},
}: QueueFormProps) {
  const readOnly = mode === "view";

  const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-200
    px-4
    py-3
    outline-none
    transition
    focus:border-[#2845D6]
    focus:ring-2
    focus:ring-[#2845D6]/20
    disabled:bg-slate-100
    disabled:text-slate-500
    disabled:cursor-not-allowed
  `;

  const labelClass = "text-sm font-medium text-slate-700";

  return (
    <div className="py-6 space-y-8">
      {/* ================= Queue Information ================= */}

      <section>
        <h3 className="mb-5 text-lg font-semibold text-slate-800">
          Queue Information
        </h3>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Queue Number */}

          <div className="space-y-2">
            <label className={labelClass}>Queue Number</label>

            <input
              disabled
              defaultValue={defaultValues.queueNumber}
              placeholder="Auto Generated (A001)"
              className={inputClass}
            />
          </div>

          {/* Client Name */}

          <div className="space-y-2">
            <label className={labelClass}>Client Name</label>

            <input
              disabled={readOnly}
              defaultValue={defaultValues.clientName}
              placeholder="Enter client's full name"
              className={inputClass}
            />
          </div>

          {/* Service */}

          <div className="space-y-2">
            <label className={labelClass}>Service</label>

            <select
              disabled={readOnly}
              defaultValue={defaultValues.service}
              className={inputClass}
            >
              <option value="">Select Service</option>

              <option value="Registrar">Registrar</option>

              <option value="Cashier">Cashier</option>

              <option value="Admission">Admission</option>

              <option value="Accounting">Accounting</option>

              <option value="Guidance">Guidance</option>
            </select>
          </div>

          {/* Counter */}

          <div className="space-y-2">
            <label className={labelClass}>Assigned Counter</label>

            <select
              disabled={readOnly}
              defaultValue={defaultValues.counter}
              className={inputClass}
            >
              <option value="">Select Counter</option>

              <option value="Counter 1">Counter 1</option>

              <option value="Counter 2">Counter 2</option>

              <option value="Counter 3">Counter 3</option>

              <option value="Counter 4">Counter 4</option>

              <option value="Counter 5">Counter 5</option>
            </select>
          </div>
        </div>
      </section>

      {/* ================= Client Information ================= */}

      <section>
        <h3 className="mb-5 text-lg font-semibold text-slate-800">
          Client Information
        </h3>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Priority */}

          <div className="space-y-2">
            <label className={labelClass}>Priority Type</label>

            <select
              disabled={readOnly}
              defaultValue={defaultValues.priority}
              className={inputClass}
            >
              <option value="Regular">Regular</option>

              <option value="Senior Citizen">Senior Citizen</option>

              <option value="PWD">PWD</option>

              <option value="Pregnant">Pregnant</option>

              <option value="Priority">Priority</option>
            </select>
          </div>

          {/* Mobile */}

          <div className="space-y-2">
            <label className={labelClass}>Mobile Number</label>

            <input
              disabled={readOnly}
              defaultValue={defaultValues.mobile}
              placeholder="09XXXXXXXXX"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ================= Queue Settings ================= */}

      <section>
        <h3 className="mb-5 text-lg font-semibold text-slate-800">
          Queue Settings
        </h3>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Initial Status */}

          <div className="space-y-2">
            <label className={labelClass}>Initial Status</label>

            <select
              disabled={readOnly}
              defaultValue={defaultValues.status}
              className={inputClass}
            >
              <option value="Waiting">Waiting</option>

              <option value="Serving">Serving</option>

              <option value="Completed">Completed</option>

              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* SMS */}

          <div className="space-y-2">
            <label className={labelClass}>SMS Notification</label>

            <select
              disabled={readOnly}
              defaultValue={defaultValues.sms}
              className={inputClass}
            >
              <option value="Enable">Enable</option>

              <option value="Disable">Disable</option>
            </select>
          </div>

          {/* Remarks */}

          <div className="space-y-2 lg:col-span-2">
            <label className={labelClass}>Remarks / Notes</label>

            <textarea
              disabled={readOnly}
              defaultValue={defaultValues.remarks}
              rows={4}
              placeholder="Additional notes regarding this queue..."
              className={inputClass}
            />
          </div>
        </div>
      </section>
    </div>
  );
}