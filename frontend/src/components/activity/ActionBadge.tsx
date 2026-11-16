
import { Badge } from "@/components/ui/badge";
import {
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  MessageSquare,
  BrainCircuit,
  Activity,
} from "lucide-react";

interface ActionBadgeProps {
  action: string;
}

export default function ActionBadge({ action }: ActionBadgeProps) {
  const normalizedAction = action.toLowerCase();

  if (normalizedAction.includes("login")) {
    return (
      <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
        <LogIn className="h-3.5 w-3.5" />
        Login
      </Badge>
    );
  }

  if (normalizedAction.includes("logout")) {
    return (
      <Badge variant="secondary" className="gap-1 bg-slate-100 text-slate-700 hover:bg-slate-100">
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </Badge>
    );
  }

  if (normalizedAction.includes("created") || normalizedAction.includes("create")) {
    return (
      <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        <Plus className="h-3.5 w-3.5" />
        Create
      </Badge>
    );
  }

  if (normalizedAction.includes("updated") || normalizedAction.includes("update")) {
    return (
      <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
        <Pencil className="h-3.5 w-3.5" />
        Update
      </Badge>
    );
  }

  if (normalizedAction.includes("deleted") || normalizedAction.includes("delete")) {
    return (
      <Badge variant="secondary" className="gap-1 bg-red-100 text-red-700 hover:bg-red-100">
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </Badge>
    );
  }

  if (normalizedAction.includes("sms")) {
    return (
      <Badge variant="secondary" className="gap-1 bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
        <MessageSquare className="h-3.5 w-3.5" />
        SMS
      </Badge>
    );
  }

  if (normalizedAction.includes("forecast")) {
    return (
      <Badge variant="secondary" className="gap-1 bg-violet-100 text-violet-700 hover:bg-violet-100">
        <BrainCircuit className="h-3.5 w-3.5" />
        Forecast
      </Badge>
    );
  }

  const readableAction = action
    .split(/[._]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Badge variant="outline" className="gap-1">
      <Activity className="h-3.5 w-3.5" />
      {readableAction || "Unknown"}
    </Badge>
  );
}
