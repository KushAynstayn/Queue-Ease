"use client";

import {
  FormEvent,
  useState,
} from "react";

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

import type {
  AdminUser,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/services/users/user.service";

interface BaseUserFormProps {
  user?: AdminUser;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface CreateUserFormProps
  extends BaseUserFormProps {
  mode: "create";
  onSubmit: (
    payload: CreateUserPayload
  ) => Promise<void>;
}

interface EditUserFormProps
  extends BaseUserFormProps {
  mode: "edit";
  user: AdminUser;
  onSubmit: (
    payload: UpdateUserPayload
  ) => Promise<void>;
}

type UserFormProps =
  | CreateUserFormProps
  | EditUserFormProps;

export default function UserForm(
  props: UserFormProps
) {
  const {
    user,
    isLoading = false,
    onCancel,
  } = props;

  const [firstName, setFirstName] =
    useState(
      user?.first_name ?? ""
    );

  const [middleName, setMiddleName] =
    useState(
      user?.middle_name ?? ""
    );

  const [lastName, setLastName] =
    useState(
      user?.last_name ?? ""
    );

  const [email, setEmail] =
    useState(
      user?.email ?? ""
    );

  const [phone, setPhone] =
    useState(
      user?.phone ?? ""
    );

  const [username, setUsername] =
    useState(
      user?.username ?? ""
    );

  const [password, setPassword] =
    useState("");

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");

  const [roleId, setRoleId] =
    useState(
      user?.role_id
        ? String(user.role_id)
        : "3"
    );

  const [status, setStatus] =
    useState<
      "active" |
      "inactive" |
      "suspended"
    >(
      user?.status ?? "active"
    );

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError(
        "First name and last name are required."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Email address is required."
      );
      return;
    }

    if (!username.trim()) {
      setError(
        "Username is required."
      );
      return;
    }

    if (props.mode === "create") {
      if (!password) {
        setError(
          "Password is required."
        );
        return;
      }

      if (
        password !==
        passwordConfirmation
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }

      const payload: CreateUserPayload = {
        role_id: Number(roleId),
        first_name:
          firstName.trim(),
        middle_name:
          middleName.trim() || null,
        last_name:
          lastName.trim(),
        username:
          username.trim(),
        email:
          email.trim(),
        phone:
          phone.trim(),
        password,
        password_confirmation:
          passwordConfirmation,
        status,
      };

      try {
        await props.onSubmit(
          payload
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to create user."
        );
      }

      return;
    }

    const payload: UpdateUserPayload = {
      role_id: Number(roleId),
      first_name:
        firstName.trim(),
      middle_name:
        middleName.trim() || null,
      last_name:
        lastName.trim(),
      username:
        username.trim(),
      email:
        email.trim(),
      phone:
        phone.trim(),
    };

    try {
      await props.onSubmit(
        payload
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update user."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Name */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name
          </Label>

          <Input
            id="firstName"
            value={firstName}
            onChange={(event) =>
              setFirstName(
                event.target.value
              )
            }
            placeholder="Juan"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">
            Middle Name
          </Label>

          <Input
            id="middleName"
            value={middleName}
            onChange={(event) =>
              setMiddleName(
                event.target.value
              )
            }
            placeholder="Santos"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name
          </Label>

          <Input
            id="lastName"
            value={lastName}
            onChange={(event) =>
              setLastName(
                event.target.value
              )
            }
            placeholder="Dela Cruz"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Contact */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address
          </Label>

          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="juan@queueease.com"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number
          </Label>

          <Input
            id="phone"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value
              )
            }
            placeholder="+63 912 345 6789"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Account */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="username">
            Username
          </Label>

          <Input
            id="username"
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value
              )
            }
            placeholder="juan.delacruz"
            disabled={isLoading}
          />
        </div>

        {props.mode === "create" && (
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      {/* Confirm Password */}
      {props.mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="passwordConfirmation">
            Confirm Password
          </Label>

          <Input
            id="passwordConfirmation"
            type="password"
            value={
              passwordConfirmation
            }
            onChange={(event) =>
              setPasswordConfirmation(
                event.target.value
              )
            }
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
      )}

      {/* Role / Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Role</Label>

          <Select
            value={roleId}
            onValueChange={(value) =>
              setRoleId(
                value ?? "3"
              )
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

        <div className="space-y-2">
          <Label>Status</Label>

          <Select
            value={status}
            onValueChange={(value) =>
              setStatus(
                (value ??
                  "active") as
                  | "active"
                  | "inactive"
                  | "suspended"
              )
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">
                Active
              </SelectItem>

              <SelectItem value="inactive">
                Inactive
              </SelectItem>

              <SelectItem value="suspended">
                Suspended
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
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
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : props.mode === "create"
              ? "Save User"
              : "Update User"}
        </Button>
      </div>
    </form>
  );
}