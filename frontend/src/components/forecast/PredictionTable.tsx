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

const predictions = [
  {
    hour: "8:00 AM",
    visitors: 24,
    wait: "5 mins",
    demand: "Low",
  },
  {
    hour: "9:00 AM",
    visitors: 49,
    wait: "9 mins",
    demand: "Moderate",
  },
  {
    hour: "10:00 AM",
    visitors: 84,
    wait: "18 mins",
    demand: "High",
  },
  {
    hour: "11:00 AM",
    visitors: 98,
    wait: "22 mins",
    demand: "Very High",
  },
  {
    hour: "12:00 PM",
    visitors: 75,
    wait: "15 mins",
    demand: "High",
  },
  {
    hour: "1:00 PM",
    visitors: 68,
    wait: "12 mins",
    demand: "Moderate",
  },
];

function badgeVariant(level: string) {
  switch (level) {
    case "Low":
      return "secondary";

    case "Moderate":
      return "outline";

    case "High":
      return "default";

    case "Very High":
      return "destructive";

    default:
      return "secondary";
  }
}

export default function PredictionTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Table</CardTitle>

        <CardDescription>
          Hourly AI forecast for expected queue demand.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Expected Visitors</TableHead>
              <TableHead>Estimated Wait</TableHead>
              <TableHead>Demand</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {predictions.map((item) => (
              <TableRow key={item.hour}>
                <TableCell className="font-medium">
                  {item.hour}
                </TableCell>

                <TableCell>
                  {item.visitors}
                </TableCell>

                <TableCell>
                  {item.wait}
                </TableCell>

                <TableCell>
                  <Badge variant={badgeVariant(item.demand)}>
                    {item.demand}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}