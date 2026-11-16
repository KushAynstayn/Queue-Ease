
"use client";

interface HourlyVolume {
  hour: number;
  time: string;
  clients: number;
}

interface QueueVolumeChartProps {
  data: HourlyVolume[];
  loading: boolean;
}

export function QueueVolumeChart({
  data,
  loading,
}: QueueVolumeChartProps) {
  const maxClients = Math.max(
    ...data.map((item) => item.clients),
    1
  );

  if (loading) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
        Loading queue volume...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No completed queue transactions recorded today.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex h-[320px] items-end gap-3 border-b border-l px-4 pb-0 pt-6 sm:gap-5">
        {data.map((item) => {
          const height = (item.clients / maxClients) * 100;

          return (
            <div
              key={item.hour}
              className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
            >
              <div className="flex flex-1 items-end justify-center">
                <div
                  className="w-full max-w-12 rounded-t-md bg-primary transition-all hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    minHeight: "2px",
                  }}
                  title={`${item.clients} clients`}
                />
              </div>

              <span className="whitespace-nowrap text-center text-xs text-muted-foreground">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Time</span>
        <span>Clients Served</span>
      </div>
    </div>
  );
}
