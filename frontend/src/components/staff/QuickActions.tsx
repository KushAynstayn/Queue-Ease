"use client";

import {
  ListRestart,
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

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>

        <CardDescription>
          Common queue operations.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button className="w-full justify-start">
          <PhoneCall className="mr-2 h-4 w-4" />
          Call Next Student
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Queue
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
        >
          <ListRestart className="mr-2 h-4 w-4" />
          View Full Queue
        </Button>
      </CardContent>
    </Card>
  );
}