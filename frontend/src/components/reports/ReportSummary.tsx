import {
  FileText,
  CalendarDays,
  Clock3,
  Download,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const reports = [
  {
    title: "Reports Generated",
    value: "248",
    description: "Total generated reports",
    icon: FileText,
  },
  {
    title: "Today's Reports",
    value: "12",
    description: "Generated today",
    icon: CalendarDays,
  },
  {
    title: "Last Export",
    value: "2:15 PM",
    description: "August 4, 2026",
    icon: Clock3,
  },
  {
    title: "Available Formats",
    value: "PDF / XLSX / CSV",
    description: "Supported export formats",
    icon: Download,
  },
];

export default function ReportSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {reports.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="rounded-full bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}