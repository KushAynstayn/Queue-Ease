"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ApiTestPage() {
  const [message, setMessage] = useState("Testing API...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function testApi() {
      try {
        const data = await apiRequest<{ message: string }>("/services");

        setMessage(data.message);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to connect to API."
        );
      }
    }

    testApi();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="rounded-xl border p-8">
        <h1 className="mb-4 text-2xl font-bold">
          Queue Ease API Test
        </h1>

        {error ? (
          <p className="text-red-500">
            API Error: {error}
          </p>
        ) : (
          <p className="text-green-600">
            API Response: {message}
          </p>
        )}
      </div>
    </main>
  );
}