
"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { FormEvent } from "react";

interface ActivityFiltersState {
  search: string;
  from: string;
  to: string;
}

interface ActivityFiltersProps {
  onApply: (filters: ActivityFiltersState) => void;
  loading: boolean;
}

export default function ActivityFilters({
  onApply,
  loading,
}: ActivityFiltersProps) {
  const [filters, setFilters] = useState<ActivityFiltersState>({
    search: "",
    from: "",
    to: "",
  });

  const [dateError, setDateError] = useState<string | null>(null);

  function updateFilter(
    field: keyof ActivityFiltersState,
    value: string
  ) {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));

    setDateError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (filters.from && filters.to && filters.from > filters.to) {
      setDateError("Start date cannot be later than end date.");
      return;
    }

    setDateError(null);
    onApply(filters);
  }

  function handleReset() {
    const emptyFilters = {
      search: "",
      from: "",
      to: "",
    };

    setFilters(emptyFilters);
    setDateError(null);
    onApply(emptyFilters);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search and Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Search Activities
              </label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={filters.search}
                  onChange={(event) =>
                    updateFilter("search", event.target.value)
                  }
                  placeholder="Search user, action, description..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Start Date
              </label>

              <Input
                type="date"
                value={filters.from}
                max={filters.to || undefined}
                onChange={(event) =>
                  updateFilter("from", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                End Date
              </label>

              <Input
                type="date"
                value={filters.to}
                min={filters.from || undefined}
                onChange={(event) =>
                  updateFilter("to", event.target.value)
                }
              />
            </div>
          </div>

          {dateError && (
            <p className="text-sm text-red-600">
              {dateError}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>

            <Button type="submit" disabled={loading}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
