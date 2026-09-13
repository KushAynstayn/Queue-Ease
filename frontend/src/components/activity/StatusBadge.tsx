import { Badge } from "@/components/ui/badge";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  switch (status) {
    case "Success":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Success
        </Badge>
      );

    case "Warning":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Warning
        </Badge>
      );

    case "Failed":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-red-100 text-red-700 hover:bg-red-100"
        >
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
}