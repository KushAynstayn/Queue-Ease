
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import { ApiRequestError, apiRequest } from "@/lib/api";

type NotificationPreference = "sms" | "system" | "both";

interface RegisterForm {
  first_name: string;
  middle_name: string;
  last_name: string;
  student_number: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  password_confirmation: string;
  notification_preference: NotificationPreference;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role_id: number;
    role: {
      id: number;
      name: string;
    };
    client: {
      student_number: string;
      notification_preference: NotificationPreference;
    };
  };
}

const initialForm: RegisterForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  student_number: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  password_confirmation: "",
  notification_preference: "both",
};

export default function RegisterCard() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState("");

  const updateField = <K extends keyof RegisterForm>(
    field: K,
    value: RegisterForm[K]
    ) => {
    setForm((previous) => ({
        ...previous,
        [field]: value,
    }));

    setFieldErrors((previous) => ({
        ...previous,
        [field]: [],
    }));

    setError("");
    };

  const getFieldError = (field: keyof RegisterForm) =>
    fieldErrors[field]?.[0];

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setFieldErrors({});

    if (form.password !== form.password_confirmation) {
      setFieldErrors({
        password_confirmation: ["Passwords do not match."],
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest<RegisterResponse>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );

      setSuccess(
        response.message ||
          "Your student account has been created successfully."
      );

      setForm(initialForm);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        setFieldErrors(err.errors ?? {});
      } else {
        setError("Unable to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-blue-200 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60";

  const labelClass =
    "mb-2 block text-sm font-medium text-blue-50";

  if (success) {
    return (
      <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
          <UserPlus size={28} />
        </div>

        <h1 className="text-3xl font-bold">
          Registration Successful!
        </h1>

        <p className="mt-3 leading-7 text-blue-100">
          {success}
        </p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-[#2845D6] transition hover:bg-blue-50"
        >
          Continue to Sign In
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      <div className="mb-7">
        <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
          Queue Ease
        </div>

        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
          Create Your Account
        </h1>

        <p className="mt-2 text-sm leading-6 text-blue-100">
          Register as a student to join queues and monitor
          your queue status.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Information */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-200">
            Student Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>First Name *</label>
              <input
                required
                maxLength={100}
                value={form.first_name}
                onChange={(e) =>
                  updateField("first_name", e.target.value)
                }
                placeholder="Enter first name"
                className={inputClass}
                disabled={isLoading}
              />
              {getFieldError("first_name") && (
                <p className="mt-1 text-xs text-red-200">
                  {getFieldError("first_name")}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Middle Name</label>
              <input
                maxLength={100}
                value={form.middle_name}
                onChange={(e) =>
                  updateField("middle_name", e.target.value)
                }
                placeholder="Optional"
                className={inputClass}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className={labelClass}>Last Name *</label>
              <input
                required
                maxLength={100}
                value={form.last_name}
                onChange={(e) =>
                  updateField("last_name", e.target.value)
                }
                placeholder="Enter last name"
                className={inputClass}
                disabled={isLoading}
              />
              {getFieldError("last_name") && (
                <p className="mt-1 text-xs text-red-200">
                  {getFieldError("last_name")}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Student Number *</label>
              <input
                required
                maxLength={50}
                value={form.student_number}
                onChange={(e) =>
                  updateField("student_number", e.target.value)
                }
                placeholder="e.g. 1333711"
                className={inputClass}
                disabled={isLoading}
              />
              {getFieldError("student_number") && (
                <p className="mt-1 text-xs text-red-200">
                  {getFieldError("student_number")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-200">
            Contact Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Email Address *</label>
              <input
                required
                type="email"
                maxLength={150}
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
                placeholder="student@example.com"
                className={inputClass}
                disabled={isLoading}
              />
              {getFieldError("email") && (
                <p className="mt-1 text-xs text-red-200">
                  {getFieldError("email")}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Phone Number *</label>
              <input
                required
                type="tel"
                maxLength={20}
                value={form.phone}
                onChange={(e) =>
                  updateField("phone", e.target.value)
                }
                placeholder="09XXXXXXXXX"
                className={inputClass}
                disabled={isLoading}
              />
              {getFieldError("phone") && (
                <p className="mt-1 text-xs text-red-200">
                  {getFieldError("phone")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Account Credentials */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-200">
            Account Credentials
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Username *</label>
              <input
                required
                maxLength={100}
                value={form.username}
                onChange={(e) =>
                  updateField("username", e.target.value)
                }
                placeholder="Choose a username"
                autoComplete="username"
                className={inputClass}
                disabled={isLoading}
              />
              {getFieldError("username") && (
                <p className="mt-1 text-xs text-red-200">
                  {getFieldError("username")}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Password *</label>
              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    updateField("password", e.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-blue-200 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {getFieldError("password") && (
                <p className="mt-1 text-xs text-red-200">
                  {getFieldError("password")}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Confirm Password *</label>
              <div className="relative">
                <input
                  required
                  type={showConfirmation ? "text" : "password"}
                  value={form.password_confirmation}
                  onChange={(e) =>
                    updateField("password_confirmation", e.target.value)
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmation(!showConfirmation)
                  }
                  className="absolute right-4 top-3.5 text-blue-200 hover:text-white"
                  aria-label="Toggle password confirmation visibility"
                >
                  {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {getFieldError("password_confirmation") && (
                <p className="mt-1 text-xs text-red-200">
                  {getFieldError("password_confirmation")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Notification Preference */}
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-200">
            Notification Preference
          </h2>

          <p className="mb-3 text-xs text-blue-100">
            Choose how you would like to receive queue updates.
          </p>

          <select
            value={form.notification_preference}
            onChange={(e) =>
                updateField(
                    "notification_preference",
                    e.target.value as NotificationPreference
                )
            }
            className={`${inputClass} bg-[#17358f]`}
            disabled={isLoading}
          >
            <option value="both">SMS and System Notifications</option>
            <option value="sms">SMS Only</option>
            <option value="system">System Notifications Only</option>
          </select>
        </section>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-[#2845D6] shadow-xl transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-blue-100">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-cyan-200 hover:text-white"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
