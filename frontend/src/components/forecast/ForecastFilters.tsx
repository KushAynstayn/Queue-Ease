"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarDays, BrainCircuit } from "lucide-react";

export default function ForecastFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">

          {/* Date */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Date
            </label>

            <Select defaultValue="today">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">Next 7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Service
            </label>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="registrar">Registrar</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="admission">Admission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prediction */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Prediction Range
            </label>

            <Select defaultValue="hourly">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="hourly">
                  Hourly
                </SelectItem>

                <SelectItem value="daily">
                  Daily
                </SelectItem>

                <SelectItem value="weekly">
                  Weekly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button */}

          <div className="flex items-end">
            <Button className="w-full gap-2">
              <BrainCircuit className="h-4 w-4" />

              Generate Forecast
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}