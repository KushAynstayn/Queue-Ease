
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogOut, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import QueueHeader from "@/components/client/queue/QueueHeader";
import QueueStatusCard from "@/components/client/queue/QueueStatusCard";
import QueuePosition from "@/components/client/queue/QueuePosition";
import QueueStatusInfo from "@/components/client/queue/QueueStatusInfo";
import ServiceSelection, {
  type QueueService,
} from "@/components/client/queue/ServiceSelection";
import QueueConfirmation from "@/components/client/queue/QueueConfirmation";

import { ApiRequestError, apiRequest } from "@/lib/api";

interface QueueCounter {
  id: number;
  name: string;
  counter_number?: string | number;
  status?: string;
}

interface ActiveQueue {
  id: number;
  queue_number: string;
  queue_date: string;
  status: string;
  position_number: number | null;
  estimated_wait_minutes: number | null;
  service: {
    id: number;
    name: string;
    code?: string;
  } | null;
  counter: QueueCounter | null;
  total_waiting?: number;
  current_serving_queue_number?: string | null;
}

interface ActiveQueueResponse {
  success: boolean;
  message: string;
  data: {
    has_active_queue: boolean;
    queue: ActiveQueue | null;
  };
}

interface ServicesResponse {
  success: boolean;
  message: string;
  data: QueueService[];
}

interface CreateQueueResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    queue_number: string;
    status: string;
    estimated_wait_minutes: number | null;
    service_name?: string;
  };
}

function formatEstimatedWait(minutes: number | null): string {
  if (
    minutes === null ||
    !Number.isFinite(minutes) ||
    minutes < 0
  ) {
    return "Calculating...";
  }

  if (minutes === 0) {
    return "Your turn is approaching";
  }

  return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    waiting: "Waiting",
    called: "Please proceed",
    serving: "Now serving",
  };

  return labels[status.toLowerCase()] ?? status;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 401 || error.status === 403) {
      return "Your session may have expired, or your account does not have permission to perform this action. Please sign in again if needed.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function Page() {
  const [queue, setQueue] = useState<ActiveQueue | null>(null);
  const [services, setServices] = useState<QueueService[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [joining, setJoining] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [confirmation, setConfirmation] = useState<{
    queueNumber: string;
    serviceName: string;
    estimatedWait: string;
    status: string;
  } | null>(null);

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setServiceError(null);

    try {
      const response = await apiRequest<ServicesResponse>(
        "/client/services"
      );

      if (!response.success) {
        throw new Error(
          response.message || "Unable to retrieve available services."
        );
      }

      setServices(response.data ?? []);
    } catch (err) {
      setServiceError(getErrorMessage(err));
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  }, []);

  const loadActiveQueue = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<ActiveQueueResponse>(
        "/client/active-queue"
      );

      if (!response.success) {
        throw new Error(
          response.message || "Unable to retrieve your queue."
        );
      }

      const activeQueue = response.data?.has_active_queue
        ? response.data.queue
        : null;

      setQueue(activeQueue);

      if (!activeQueue) {
        await loadServices();
      } else {
        setServices([]);
        setSelectedService(null);
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setQueue(null);
    } finally {
      setLoading(false);
    }
  }, [loadServices]);

  useEffect(() => {
    void loadActiveQueue();
  }, [loadActiveQueue]);

  const handleJoinQueue = async () => {
    if (!selectedService) {
      setJoinError("Please select an enrollment service first.");
      return;
    }

    setJoining(true);
    setJoinError(null);

    try {
      const response = await apiRequest<CreateQueueResponse>(
        "/queues",
        {
          method: "POST",
          body: JSON.stringify({
            service_id: selectedService,
            priority: "normal",
          }),
        }
      );

      if (!response.success) {
        throw new Error(
          response.message || "Unable to create your queue."
        );
      }

      const createdQueue = response.data;
      const selectedServiceDetails = services.find(
        (service) => service.id === selectedService
      );

      setConfirmation({
        queueNumber: createdQueue.queue_number,
        serviceName:
          createdQueue.service_name ??
          selectedServiceDetails?.name ??
          "Enrollment Service",
        estimatedWait: formatEstimatedWait(
          createdQueue.estimated_wait_minutes
        ),
        status: formatStatus(createdQueue.status),
      });

      setQueue(null);
      setServices([]);
    } catch (err) {
      setJoinError(getErrorMessage(err));
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <QueueHeader />

        <Link
          href="/client"
          className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {loading ? (
        <div
          className="rounded-xl border p-8 text-center"
          role="status"
          aria-live="polite"
        >
          <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-muted-foreground" />
          <p className="font-medium">Loading your queue...</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Retrieving your latest queue status.
          </p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 p-6" role="alert">
          <h2 className="font-semibold">Unable to load your queue</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void loadActiveQueue()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      ) : confirmation ? (
        <div className="space-y-4">
          <QueueConfirmation
            queueNumber={confirmation.queueNumber}
            serviceName={confirmation.serviceName}
            estimatedWait={confirmation.estimatedWait}
            status={confirmation.status}
          />

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmation(null);
                void loadActiveQueue();
              }}
            >
              View My Queue Status
            </Button>
          </div>
        </div>
      ) : !queue ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-dashed p-6 text-center">
            <h2 className="text-lg font-semibold">
              You are not currently in a queue
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Select an enrollment service below to request a queue number.
            </p>
          </div>

          {servicesLoading ? (
            <div className="rounded-xl border p-8 text-center" role="status">
              <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading available services...
              </p>
            </div>
          ) : serviceError ? (
            <div className="rounded-xl border border-destructive/30 p-6" role="alert">
              <h2 className="font-semibold">
                Unable to load available services
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {serviceError}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => void loadServices()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : (
            <>
              <ServiceSelection
                services={services}
                selectedService={selectedService}
                onSelect={(serviceId) => {
                  setSelectedService(serviceId);
                  setJoinError(null);
                }}
              />

              {joinError && (
                <p className="text-sm text-destructive" role="alert">
                  {joinError}
                </p>
              )}

              <div className="flex justify-end border-t pt-5">
                <Button
                  type="button"
                  disabled={!selectedService || joining || services.length === 0}
                  onClick={() => void handleJoinQueue()}
                  className="bg-[#2845D6] hover:bg-[#2845D6]/90"
                >
                  {joining ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Joining Queue...
                    </>
                  ) : (
                    "Join Queue"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <QueueStatusCard
            queueNumber={queue.queue_number}
            serviceName={queue.service?.name ?? "Enrollment Service"}
            status={formatStatus(queue.status)}
            position={queue.position_number ?? 0}
            estimatedWait={formatEstimatedWait(
              queue.estimated_wait_minutes
            )}
            currentServing={
              queue.current_serving_queue_number ?? "Not available"
            }
          />

          {queue.position_number !== null &&
            queue.position_number > 0 &&
            typeof queue.total_waiting === "number" && (
              <QueuePosition
                position={queue.position_number}
                totalWaiting={queue.total_waiting}
              />
            )}

          <QueueStatusInfo />

          <div className="flex justify-end border-t pt-6">
            <Button
              type="button"
              variant="outline"
              disabled
              title="Queue cancellation is not available yet."
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave Queue
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
