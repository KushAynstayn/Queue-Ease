
export default function QueueHeader() {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-[#2845D6]">
        My Queue
      </p>

      <h1 className="text-2xl font-bold tracking-tight">
        Queue Status
      </h1>

      <p className="text-sm text-muted-foreground">
        View your current queue number, position, and estimated waiting time.
      </p>
    </div>
  );
}
