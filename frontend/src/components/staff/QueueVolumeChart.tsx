const queueVolume = [
  { time: "8 AM", clients: 8 },
  { time: "9 AM", clients: 16 },
  { time: "10 AM", clients: 28 },
  { time: "11 AM", clients: 24 },
  { time: "12 PM", clients: 14 },
  { time: "1 PM", clients: 18 },
  { time: "2 PM", clients: 23 },
  { time: "3 PM", clients: 13 },
  { time: "4 PM", clients: 7 },
];

const maxClients = Math.max(
  ...queueVolume.map((item) => item.clients)
);

export function QueueVolumeChart() {
  return (
    <div className="w-full">
      <div className="flex h-[320px] items-end gap-3 border-b border-l px-4 pb-0 pt-6 sm:gap-5">
        {queueVolume.map((item) => {
          const height =
            (item.clients / maxClients) * 100;

          return (
            <div
              key={item.time}
              className="flex h-full flex-1 flex-col justify-end gap-2"
            >
              <div className="flex flex-1 items-end justify-center">
                <div
                  className="w-full max-w-12 rounded-t-md bg-primary transition-all hover:opacity-80"
                  style={{
                    height: `${height}%`,
                  }}
                  title={`${item.clients} clients`}
                />
              </div>

              <span className="text-center text-xs text-muted-foreground">
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