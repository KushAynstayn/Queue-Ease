
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ForecastResult } from "./ForecastSummary";
import type { ForecastTarget } from "./ForecastFilters";

interface PredictionTableProps {
  forecast: ForecastResult | null;
  target: ForecastTarget;
}

export default function PredictionTable({
  forecast,
  target,
}: PredictionTableProps) {
  const isTransactions = target === "total_transactions";

  const prediction =
    !forecast
      ? null
      : isTransactions
        ? forecast.predicted_transactions
        : forecast.predicted_wait_minutes;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
        <CardDescription>
          Experimental daily prediction returned by the AI forecasting service.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Forecast Date</TableHead>
              <TableHead>Service ID</TableHead>
              <TableHead>Prediction Target</TableHead>
              <TableHead>Predicted Value</TableHead>
              <TableHead>Model</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {forecast ? (
              <TableRow>
                <TableCell className="font-medium">
                  {forecast.forecast_date}
                </TableCell>
                <TableCell>{forecast.service_id}</TableCell>
                <TableCell>
                  {isTransactions
                    ? "Total Transactions"
                    : "Average Wait (Minutes)"}
                </TableCell>
                <TableCell>
                  {prediction === null || prediction === undefined
                    ? "Not available"
                    : isTransactions
                      ? prediction
                      : `${prediction} minutes`}
                </TableCell>
                <TableCell>{forecast.model_name ?? "Not specified"}</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No forecast generated yet. Select a service and future date,
                  then click Generate Forecast.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
