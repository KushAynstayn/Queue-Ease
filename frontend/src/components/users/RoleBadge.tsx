import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  UserCog,
  UserRound,
} from "lucide-react";

interface RoleBadgeProps {
  role: string;
}

export default function RoleBadge({
  role,
}: RoleBadgeProps) {
  switch (role) {
    case "Administrator":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-red-100 text-red-700 hover:bg-red-100"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Administrator
        </Badge>
      );

    case "Staff":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100"
        >
          <UserCog className="h-3.5 w-3.5" />
          Staff
        </Badge>
      );

    default:
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-green-100 text-green-700 hover:bg-green-100"
        >
          <UserRound className="h-3.5 w-3.5" />
          Client
        </Badge>
      );
  }
}