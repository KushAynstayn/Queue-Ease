import { Badge } from "@/components/ui/badge";

import {
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalizedStatus =
    status.toLowerCase();

  if (normalizedStatus === "active") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Active
      </Badge>
    );
  }

  if (normalizedStatus === "suspended") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100"
      >
        <AlertCircle className="h-3.5 w-3.5" />
        Suspended
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="gap-1 bg-gray-100 text-gray-700 hover:bg-gray-100"
    >
      <XCircle className="h-3.5 w-3.5" />
      Inactive
    </Badge>
  );
}