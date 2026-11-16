
"use client";

import {
  PhoneCall,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  processing: boolean;
  onCallNext: () => void | Promise<void>;
  onRefresh: () => void;
};

export function QuickActions({
  processing,
  onCallNext,
  onRefresh,
}: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common queue operations.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button
          className="w-full justify-start"
          disabled={processing}
          onClick={() => void onCallNext()}
        >
          <PhoneCall className="mr-2 h-4 w-4" />
          Call Next Student
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          disabled={processing}
          onClick={onRefresh}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Queue
        </Button>
      </CardContent>
    </Card>
  );
}
