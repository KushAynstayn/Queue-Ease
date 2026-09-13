"use client";

import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExportActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Actions</CardTitle>

        <CardDescription>
          Download or print the selected report.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>

          <Button
            variant="outline"
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>

          <Button
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>

          <Button
            variant="secondary"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}