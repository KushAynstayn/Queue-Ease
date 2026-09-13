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

export default function ReportPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Preview</CardTitle>

        <CardDescription>
          Summary of the selected report before exporting or printing.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />

            <div>
              <p className="text-sm text-muted-foreground">
                Report Name
              </p>

              <p className="font-semibold">
                Daily Queue Report
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />

            <div>
              <p className="text-sm text-muted-foreground">
                Generated Date
              </p>

              <p className="font-semibold">
                August 5, 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />

            <div>
              <p className="text-sm text-muted-foreground">
                Clients Served
              </p>

              <p className="font-semibold">
                528 Clients
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-primary" />

            <div>
              <p className="text-sm text-muted-foreground">
                Average Waiting Time
              </p>

              <p className="font-semibold">
                11 Minutes
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <h4 className="font-medium">
            Report Summary
          </h4>

          <p className="mt-2 text-sm text-muted-foreground leading-6">
            This report contains queue transactions,
            average waiting time, service completion
            statistics, and operational performance
            within the selected reporting period.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}