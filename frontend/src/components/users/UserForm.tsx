
"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import {
  getAvailableCounters,
  type AdminUser,
  type AvailableCounter,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/services/users/user.service";

interface BaseUserFormProps {
  user?: AdminUser;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface CreateUserFormProps extends BaseUserFormProps {
  mode: "create";
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
}

interface EditUserFormProps extends BaseUserFormProps {
  mode: "edit";
  user: AdminUser;
  onSubmit: (payload: UpdateUserPayload) => Promise<void>;
}

type UserFormProps = CreateUserFormProps | EditUserFormProps;

type AccountType = "admin" | "staff";
type AccountStatus = "active" | "inactive" | "suspended";

export default function UserForm(props: UserFormProps) {
  const {
    user,
    isLoading = false,
    onCancel,
  } = props;

  // Account type and counter assignment
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [counterId, setCounterId] = useState("");

  const [counters, setCounters] = useState<AvailableCounter[]>([]);
  const [isLoadingCounters, setIsLoadingCounters] = useState(false);
  const [counterError, setCounterError] = useState("");

  // Personal information
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [middleName, setMiddleName] = useState(user?.middle_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [username, setUsername] = useState(user?.username ?? "");

  // Credentials
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Edit mode
  const [roleId, setRoleId] = useState(
    user?.role_id ? String(user.role_id) : "1"
  );

  // Account status
  const [status, setStatus] = useState<AccountStatus>(
    user?.status ?? "active"
  );

  const [error, setError] = useState("");

  // Load available counters only when creating a Staff account
  useEffect(() => {
    if (props.mode !== "create" || accountType !== "staff") {
      setCounters([]);
      setCounterId("");
      setCounterError("");
      setIsLoadingCounters(false);
      return;
    }

    let cancelled = false;

    const loadCounters = async () => {
      setIsLoadingCounters(true);
      setCounterError("");

      try {
        const response = await getAvailableCounters();

        if (!cancelled) {
          setCounters(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setCounterError(
            err instanceof Error
              ? err.message
              : "Unable to load service counters."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCounters(false);
        }
      }
    };

    loadCounters();

    return () => {
      cancelled = true;
    };
  }, [props.mode, accountType]);

  // Form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!email.trim() || !username.trim() || !phone.trim()) {
      setError("Email, username, and phone number are required.");
      return;
    }

    // Create mode
    if (props.mode === "create") {
      if (!accountType) {
        setError("Please select an account type.");
        return;
      }

      if (accountType === "staff" && !counterId) {
        setError("Please assign a service counter to this staff account.");
        return;
      }

      if (!password) {
        setError("Password is required.");
        return;
      }

      if (password !== passwordConfirmation) {
        setError("Passwords do not match.");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      const payload: CreateUserPayload = {
        account_type: accountType,
        ...(accountType === "staff"
          ? { counter_id: Number(counterId) }
          : {}),
        first_name: firstName.trim(),
        middle_name: middleName.trim() || null,
        last_name: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        password_confirmation: passwordConfirmation,
        status,
      };

      try {
        await props.onSubmit(payload);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to create user."
        );
      }

      return;
    }

    // Edit mode
    const payload: UpdateUserPayload = {
      role_id: Number(roleId),
      first_name: firstName.trim(),
      middle_name: middleName.trim() || null,
      last_name: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      await props.onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update user."
      );
    }
  };

  const isCreateMode = props.mode === "create";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Account Type */}
      {isCreateMode && (
        <section className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">
              Account Type
            </h3>
            <p className="text-xs text-muted-foreground">
              Choose the account type first.
            </p>
          </div>

          <RadioGroup
            value={accountType}
            onValueChange={(value) => {
              setAccountType(value as AccountType);
              setCounterId("");
              setError("");
            }}
            disabled={isLoading}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="staff" id="account-staff" />
              <Label
                htmlFor="account-staff"
                className="cursor-pointer font-normal"
              >
                Staff
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="admin" id="account-admin" />
              <Label
                htmlFor="account-admin"
                className="cursor-pointer font-normal"
              >
                Administrator
              </Label>
            </div>
          </RadioGroup>
        </section>
      )}

      {/* Personal Information */}
      <section className="space-y-4 border-t pt-5">
        <h3 className="text-sm font-semibold">
          Personal Information
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Middle name (optional)"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63..."
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </section>

      {/* Account Credentials */}
      <section className="space-y-4 border-t pt-5">
        <h3 className="text-sm font-semibold">
          Account Credentials
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              disabled={isLoading}
              required
            />
          </div>

          {isCreateMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={isLoading}
                required
              />
            </div>
          )}

          {isCreateMode && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="passwordConfirmation">
                Confirm Password
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) =>
                  setPasswordConfirmation(e.target.value)
                }
                placeholder="Confirm password"
                disabled={isLoading}
                required
              />
            </div>
          )}
        </div>
      </section>

      {/* Staff Assignment */}
      {isCreateMode && accountType === "staff" && (
        <section className="space-y-4 border-t pt-5">
          <h3 className="text-sm font-semibold">
            Staff Assignment
          </h3>

          <div className="space-y-2">
            <Label htmlFor="counter">
              Assigned Service Counter
            </Label>

            <Select
              value={counterId}
              onValueChange={(value) =>
                setCounterId(value ?? "")
              }
              disabled={
                isLoading ||
                isLoadingCounters ||
                counters.length === 0
              }
            >
              <SelectTrigger id="counter" className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingCounters
                      ? "Loading counters..."
                      : "Select an available counter"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {counters.map((counter) => (
                  <SelectItem
                    key={counter.id}
                    value={String(counter.id)}
                  >
                    {counter.service.name} - {counter.name} (
                    {counter.counter_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {counterError && (
              <p className="text-sm text-destructive">
                {counterError}
              </p>
            )}

            {!isLoadingCounters &&
              !counterError &&
              counters.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No available service counters found.
                </p>
              )}

            <p className="text-xs text-muted-foreground">
              Only counters available for assignment should appear here.
            </p>
          </div>
        </section>
      )}

      {/* Role - Edit Only */}
      {!isCreateMode && (
        <section className="space-y-3 border-t pt-5">
          <h3 className="text-sm font-semibold">
            Account Role
          </h3>

          <div className="space-y-2">
            <Label>Role</Label>

            <Select
              value={roleId}
              onValueChange={(value) =>
                setRoleId(value ?? "1")
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="1">
                  Administrator
                </SelectItem>
                <SelectItem value="2">
                  Staff
                </SelectItem>
                <SelectItem value="3">
                  Client
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
      )}

      {/* Account Status - Create Only */}
      {isCreateMode && (
        <section className="space-y-3 border-t pt-5">
          <h3 className="text-sm font-semibold">
            Account Status
          </h3>

          <RadioGroup
            value={status}
            onValueChange={(value) =>
              setStatus(value as AccountStatus)
            }
            disabled={isLoading}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="active"
                id="status-active"
              />
              <Label
                htmlFor="status-active"
                className="cursor-pointer font-normal"
              >
                Active
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="inactive"
                id="status-inactive"
              />
              <Label
                htmlFor="status-inactive"
                className="cursor-pointer font-normal"
              >
                Inactive
              </Label>
            </div>
          </RadioGroup>
        </section>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isLoading ||
            (isCreateMode &&
              (!accountType ||
                (accountType === "staff" &&
                  (isLoadingCounters ||
                    counters.length === 0 ||
                    !counterId))))
          }
        >
          {isLoading
            ? "Saving..."
            : isCreateMode
              ? "Create Account"
              : "Update User"}
        </Button>
      </div>
    </form>
  );
}
