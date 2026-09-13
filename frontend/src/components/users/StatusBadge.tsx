import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const isActive = status === "Active";

  return (
    <Badge
      variant="secondary"
      className={
        isActive
          ? "gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
          : "gap-1 bg-gray-100 text-gray-700 hover:bg-gray-100"
      }
    >
      {isActive ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </>
      ) : (
        <>
          <XCircle className="h-3.5 w-3.5" />
          Inactive
        </>
      )}
    </Badge>
  );
}