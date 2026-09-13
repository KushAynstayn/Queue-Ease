"use client";

import {
  Check,
  FileText,
  GraduationCap,
  HelpCircle,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

interface ServiceSelectionProps {
  selectedService: string | null;
  onSelect: (serviceId: string) => void;
}

const services: Service[] = [
  {
    id: "enrollment",
    name: "Enrollment",
    description:
      "Process your enrollment and submit the required enrollment documents.",
    icon: GraduationCap,
  },
  {
    id: "enrollment-records",
    name: "Enrollment Records",
    description:
      "Request assistance with enrollment records and related documents.",
    icon: FileText,
  },
  {
    id: "enrollment-assistance",
    name: "Enrollment Assistance",
    description:
      "Get assistance with enrollment concerns and other enrollment-related inquiries.",
    icon: HelpCircle,
  },
];

export default function ServiceSelection({
  selectedService,
  onSelect,
}: ServiceSelectionProps) {
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

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;

          return (
            <button
              key={service.id}
              type="button"
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
                  isSelected
                    ? "bg-[#2845D6]/10"
                    : "bg-muted"
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
                {service.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { services };