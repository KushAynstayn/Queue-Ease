import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const demandLevels = [
  {
    color: "bg-green-500",
    label: "Low Demand",
  },
  {
    color: "bg-yellow-500",
    label: "Moderate Demand",
  },
  {
    color: "bg-orange-500",
    label: "High Demand",
  },
  {
    color: "bg-red-500",
    label: "Very High Demand",
  },
];

const chartLines = [
  {
    color: "bg-blue-600",
    label: "Actual Queue",
  },
  {
    color: "bg-violet-600",
    label: "AI Prediction",
  },
];

export default function ForecastLegend() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Legend</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-3 text-sm font-semibold">
            Demand Levels
          </h4>

          <div className="space-y-3">
            {demandLevels.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3"
              >
                <div
                  className={`h-4 w-4 rounded-full ${item.color}`}
                />

                <span className="text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">
            Chart Lines
          </h4>

          <div className="space-y-3">
            {chartLines.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3"
              >
                <div
                  className={`h-1 w-8 rounded ${item.color}`}
                />

                <span className="text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}