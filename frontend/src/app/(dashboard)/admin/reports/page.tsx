import ReportFilters from "@/components/reports/ReportFilters";
import ReportSummary from "@/components/reports/ReportSummary";
import ReportsTable from "@/components/reports/ReportsTable";
import ReportPreview from "@/components/reports/ReportPreview";
import ExportActions from "@/components/reports/ExportActions";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports
        </h1>

        <p className="mt-2 text-muted-foreground">
          Generate, preview, and export queue reports for operational
          monitoring and administrative records.
        </p>
      </div>

      {/* Filters */}
      <ReportFilters />

      {/* Summary */}
      <ReportSummary />

      {/* Reports Table */}
      <ReportsTable />

      {/* Preview */}
      <ReportPreview />

      {/* Export Actions */}
      <ExportActions />
    </div>
  );
}