
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

import { Badge } from "@/components/ui/badge";

import { ServicePerformanceData } from "@/types/analytics";

interface PerformanceMetricsProps {
  data: ServicePerformanceData[];
}

export default function PerformanceMetrics({
  data,
}: PerformanceMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Performance</CardTitle>

        <CardDescription>
          Performance summary for each service.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No service performance data available.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Total Queues</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Average Wait</TableHead>
                <TableHead>Completion Rate</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((item) => (
                <TableRow key={item.service_id}>
                  <TableCell className="font-medium">
                    {item.service_name}
                  </TableCell>

                  <TableCell>
                    {item.total_queues}
                  </TableCell>

                  <TableCell>
                    {item.completed_queues}
                  </TableCell>

                  <TableCell>
                    {item.average_wait_minutes ?? 0} mins
                  </TableCell>

                  <TableCell>
                    <Badge>
                      {item.completion_rate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
