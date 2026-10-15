"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface LoginUser {
  id: number;
  role_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  role: {
    id: number;
    name: string;
    description: string;
  };
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: string;
    user: LoginUser;
  };
}

export default function LoginCard() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const { token, user } = response.data;

      /*
       * Store the token based on the "Remember me" option.
       * localStorage = persists after browser restart
       * sessionStorage = removed when browser session ends
       */
      if (rememberMe) {
        localStorage.setItem("queue_ease_token", token);
        localStorage.setItem(
          "queue_ease_user",
          JSON.stringify(user)
        );

        sessionStorage.removeItem("queue_ease_token");
        sessionStorage.removeItem("queue_ease_user");
      } else {
        sessionStorage.setItem("queue_ease_token", token);
        sessionStorage.setItem(
          "queue_ease_user",
          JSON.stringify(user)
        );

        localStorage.removeItem("queue_ease_token");
        localStorage.removeItem("queue_ease_user");
      }

      /*
       * Redirect based on the role name returned
       * by Laravel. No role IDs are hardcoded.
       */
      switch (user.role.name) {
        case "admin":
          router.push("/admin");
          break;

        case "staff":
          router.push("/staff");
          break;

        case "client":
          router.push("/client");
          break;

        default:
          setError("Your account does not have a valid role.");
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.8,
        delay: 0.4,
      }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-wider text-cyan-200 uppercase">
            AI Powered
          </div>

          <h1 className="mt-5 text-4xl font-black text-white">
            Welcome Back
          </h1>

          <p className="mt-3 text-blue-100">
            Sign in to continue managing smarter queues.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username / Email */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-4 text-blue-200"
            />

            <input
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="Username or Email"
              autoComplete="username"
              disabled={isLoading}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-white placeholder:text-blue-200 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-4 text-blue-200"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-12 text-white placeholder:text-blue-200 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-3 text-blue-200 hover:text-white disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Remember Me / Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-blue-100">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                disabled={isLoading}
                className="rounded border-white/20"
              />

              Remember me
            </label>

            <button
              type="button"
              disabled={isLoading}
              className="text-cyan-200 hover:text-white disabled:opacity-50"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-[#2845D6] shadow-xl transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing In..." : "Sign In"}

            {!isLoading && (
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}