"use client";

import {
  MoreHorizontal,
  Eye,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ActivityActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
      />

      <DropdownMenuContent
        align="end"
        className="w-52"
      >
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Copy Log ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}