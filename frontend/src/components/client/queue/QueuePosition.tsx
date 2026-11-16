
interface QueuePositionProps {
  position: number;
  totalWaiting: number;
}

export default function QueuePosition({
  position,
  totalWaiting,
}: QueuePositionProps) {
  const validPosition =
    Number.isFinite(position) && position > 0;

  const validTotalWaiting =
    Number.isFinite(totalWaiting) && totalWaiting > 0;

  const progress =
    validPosition && validTotalWaiting
      ? Math.max(
          0,
          Math.min(
            100,
            ((totalWaiting - position + 1) / totalWaiting) * 100
          )
        )
      : 0;

  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">
            Queue Progress
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Track your position among clients waiting for this service.
          </p>
        </div>

        <p className="text-sm font-medium">
          {validPosition ? `Position ${position}` : "Position unavailable"}
        </p>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Queue progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-[#2845D6] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {validTotalWaiting
          ? `${totalWaiting} ${
              totalWaiting === 1 ? "client is" : "clients are"
            } currently waiting.`
          : "The number of waiting clients is not currently available."}
      </p>
    </section>
  );
}
