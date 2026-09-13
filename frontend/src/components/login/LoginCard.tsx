"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);

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

        <form className="space-y-5">

          <div className="relative">

            <User
              size={18}
              className="absolute left-4 top-4 text-blue-200"
            />

            <input
              type="text"
              placeholder="Username or Email"
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-white placeholder:text-blue-200 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
            />

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-4 text-blue-200"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-12 text-white placeholder:text-blue-200 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-3 text-blue-200 hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-blue-100">

              <input
                type="checkbox"
                className="rounded border-white/20"
              />

              Remember me

            </label>

            <button
              type="button"
              className="text-cyan-200 hover:text-white"
            >
              Forgot Password?
            </button>

          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-[#2845D6] shadow-xl transition hover:bg-blue-50"
          >
            Sign In

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />

          </motion.button>

        </form>

      </div>
    </motion.div>
  );
}