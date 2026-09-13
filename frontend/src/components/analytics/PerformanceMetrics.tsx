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

const metrics = [
  {
    service: "Registrar",
    served: 1245,
    wait: "12 mins",
    completion: "98%",
  },
  {
    service: "Cashier",
    served: 978,
    wait: "8 mins",
    completion: "96%",
  },
  {
    service: "Admission",
    served: 735,
    wait: "10 mins",
    completion: "95%",
  },
  {
    service: "Guidance",
    served: 421,
    wait: "7 mins",
    completion: "97%",
  },
];

export default function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Performance</CardTitle>

        <CardDescription>
          Historical performance summary for each service.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Clients Served</TableHead>
              <TableHead>Average Wait</TableHead>
              <TableHead>Completion Rate</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {metrics.map((item) => (
              <TableRow key={item.service}>
                <TableCell className="font-medium">
                  {item.service}
                </TableCell>

                <TableCell>{item.served}</TableCell>

                <TableCell>{item.wait}</TableCell>

                <TableCell>
                  <Badge>{item.completion}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}