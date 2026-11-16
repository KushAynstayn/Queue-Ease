
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1"
).replace(/\/+$/, "");

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("queue_ease_token");

    if (!token) {
      token = sessionStorage.getItem("queue_ease_token");
    }
  }

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiRequestError(
      "Unable to connect to the Queue Ease API. Check that Laravel is running and the API URL is correct.",
      0
    );
  }

  const responseText = await response.text();

  let data: unknown = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorData = (data ?? {}) as ApiErrorResponse;

    throw new ApiRequestError(
      errorData.message ||
        `API request failed with status ${response.status}.`,
      response.status,
      errorData.errors
    );
  }

  if (data === null) {
    throw new ApiRequestError(
      "The API returned an empty or invalid JSON response.",
      response.status
    );
  }

  return data as T;
}



export async function downloadApiFile(
  endpoint: string,
  fallbackFilename: string
): Promise<void> {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("queue_ease_token");

    if (!token) {
      token = sessionStorage.getItem("queue_ease_token");
    }
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${normalizedEndpoint}`,
      {
        method: "GET",
        headers: {
          Accept: "application/pdf, application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
      }
    );
  } catch {
    throw new ApiRequestError(
      "Unable to connect to the Queue Ease API.",
      0
    );
  }

  if (!response.ok) {
    const responseText = await response.text();

    let errorData: ApiErrorResponse = {};

    try {
      errorData = JSON.parse(responseText) as ApiErrorResponse;
    } catch {
      // Keep the default error message.
    }

    throw new ApiRequestError(
      errorData.message ||
        `PDF download failed with status ${response.status}.`,
      response.status,
      errorData.errors
    );
  }

  const blob = await response.blob();

  if (blob.size === 0) {
    throw new ApiRequestError(
      "The generated PDF file is empty.",
      response.status
    );
  }

  const disposition = response.headers.get(
    "Content-Disposition"
  );

  const filenameMatch = disposition?.match(
    /filename="?([^"]+)"?/i
  );

  const filename = filenameMatch?.[1] || fallbackFilename;

  const fileUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = fileUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(fileUrl);
}