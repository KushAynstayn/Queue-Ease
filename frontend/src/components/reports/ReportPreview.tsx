import {
  CalendarDays,
  Clock3,
  FileText,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  ReportData,
  ReportType,
  ForecastItem,
} from "./types";

import type { ElementType } from "react";

interface ReportPreviewProps {
  data: ReportData | null;
  reportType: ReportType;
  startDate: string;
  endDate: string;
}

function formatDate(date: string) {
  if (!date) return "N/A";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function isForecastData(
  data: ReportData
): data is { data: ForecastItem[]; total?: number } {
  return "data" in data && Array.isArray(data.data);
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: ElementType;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-primary" />

      <div>
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default function ReportPreview({
  data,
  reportType,
  startDate,
  endDate,
}: ReportPreviewProps) {
  const reportTitles: Record<ReportType, string> = {
    queue: "Queue Performance Report",
    sms: "SMS Notification Report",
    forecast: "Forecast Report",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Preview</CardTitle>

        <CardDescription>
          Actual report information retrieved from Queue Ease.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Metric
            label="Report Name"
            value={reportTitles[reportType]}
            icon={FileText}
          />

          <Metric
            label="Reporting Period"
            value={`${formatDate(startDate)} - ${formatDate(endDate)}`}
            icon={CalendarDays}
          />
        </div>

        {!data ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No report generated yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Select your filters and click Generate Report to
              retrieve the latest information.
            </p>
          </div>
        ) : (
          <>
            {reportType === "queue" && "total_queues" in data && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Metric
                  label="Total Queues"
                  value={data.total_queues}
                  icon={Users}
                />

                <Metric
                  label="Completed"
                  value={data.completed}
                  icon={FileText}
                />

                <Metric
                  label="Waiting"
                  value={data.waiting}
                  icon={Clock3}
                />

                <Metric
                  label="Serving"
                  value={data.serving}
                  icon={Users}
                />

                <Metric
                  label="Skipped"
                  value={data.skipped}
                  icon={FileText}
                />

                <Metric
                  label="Average Waiting Time"
                  value={`${data.average_wait_minutes} mins`}
                  icon={Clock3}
                />

                <Metric
                  label="Average Service Duration"
                  value={`${data.average_service_duration_minutes} mins`}
                  icon={Clock3}
                />
              </div>
            )}

            {reportType === "sms" && "total_sms" in data && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Metric
                  label="Total SMS"
                  value={data.total_sms}
                  icon={FileText}
                />

                <Metric
                  label="Sent"
                  value={data.sent}
                  icon={Users}
                />

                <Metric
                  label="Failed"
                  value={data.failed}
                  icon={FileText}
                />

                <Metric
                  label="Pending"
                  value={data.pending}
                  icon={Clock3}
                />
              </div>
            )}

            {reportType === "forecast" && isForecastData(data) && (
              <div className="space-y-3">
                <p className="font-medium">
                  Forecast Records: {data.total ?? data.data.length}
                </p>

                {data.data.length === 0 ? (
                  <p className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    No forecast records were found for this period.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="p-3">Date</th>
                          <th className="p-3">Service</th>
                          <th className="p-3">Predicted Queues</th>
                          <th className="p-3">Predicted Wait</th>
                          <th className="p-3">Model</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.data.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b"
                          >
                            <td className="p-3">
                              {formatDate(item.forecast_date)}
                            </td>

                            <td className="p-3">
                              {item.service?.name ?? "N/A"}
                            </td>

                            <td className="p-3">
                              {item.predicted_transactions}
                            </td>

                            <td className="p-3">
                              {item.predicted_wait_minutes} mins
                            </td>

                            <td className="p-3">
                              {item.model_name ?? "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}