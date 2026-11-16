
"use client";

import {
  Check,
  FileText,
  GraduationCap,
  HelpCircle,
} from "lucide-react";

export interface QueueService {
  id: number;
  name: string;
  code: string;
  description: string | null;
  estimated_service_minutes: number;
}

interface ServiceSelectionProps {
  services: QueueService[];
  selectedService: number | null;
  onSelect: (serviceId: number) => void;
}

function getServiceIcon(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("record")) {
    return FileText;
  }

  if (
    normalizedName.includes("assistance") ||
    normalizedName.includes("inquiry")
  ) {
    return HelpCircle;
  }

  return GraduationCap;
}

export default function ServiceSelection({
  services,
  selectedService,
  onSelect,
}: ServiceSelectionProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <p className="font-medium">No services are currently available</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please try again later or contact the enrollment office.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">
          Select an Enrollment Service
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the enrollment service you need assistance with.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = getServiceIcon(service.name);
          const isSelected = selectedService === service.id;

          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(service.id)}
              className={`relative flex min-h-[170px] flex-col items-start rounded-xl border p-5 text-left transition-all ${
                isSelected
                  ? "border-[#2845D6] bg-[#2845D6]/5 ring-1 ring-[#2845D6]"
                  : "border-border bg-background hover:border-[#2845D6]/50 hover:bg-muted/30"
              }`}
            >
              {isSelected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#2845D6]">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                  isSelected ? "bg-[#2845D6]/10" : "bg-muted"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isSelected
                      ? "text-[#2845D6]"
                      : "text-muted-foreground"
                  }`}
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                {service.name}
              </h3>

              <p className="mt-1 pr-4 text-xs leading-relaxed text-muted-foreground">
                {service.description || "Enrollment-related assistance."}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
