
interface QueueStatusCardProps {
  queueNumber: string;
  serviceName: string;
  status: string;
  position: number;
  estimatedWait: string;
  currentServing: string;
}

export default function QueueStatusCard({
  queueNumber,
  serviceName,
  status,
  position,
  estimatedWait,
  currentServing,
}: QueueStatusCardProps) {
  const normalizedStatus = status.toLowerCase();

  const statusClass =
    normalizedStatus === "waiting"
      ? "bg-amber-100 text-amber-800"
      : normalizedStatus === "please proceed" ||
          normalizedStatus === "called"
        ? "bg-blue-100 text-blue-800"
        : normalizedStatus === "now serving" ||
            normalizedStatus === "serving"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-muted text-muted-foreground";

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Your queue number
          </p>

          <h2 className="mt-1 text-4xl font-bold tracking-tight">
            {queueNumber}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Service: {serviceName}
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${statusClass}`}
          role="status"
        >
          {status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Your position
          </p>

          <p className="mt-1 text-xl font-semibold">
            {position > 0 ? `#${position}` : "Not available"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Estimated waiting time
          </p>

          <p className="mt-1 text-xl font-semibold">
            {estimatedWait}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Currently serving
          </p>

          <p className="mt-1 text-xl font-semibold">
            {currentServing}
          </p>
        </div>
      </div>
    </section>
  );
}
