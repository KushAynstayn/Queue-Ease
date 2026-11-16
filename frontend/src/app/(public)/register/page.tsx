
"use client";

import { motion } from "framer-motion";
import {
  LoginBackground,
  MouseParallaxProvider,
} from "@/components/login";
import RegisterCard from "@/components/auth/RegisterCard";

export default function RegisterPage() {
  return (
    <MouseParallaxProvider>
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#081229] via-[#163AAE] to-[#2845D6]">
        <LoginBackground />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full flex justify-center"
          >
            <RegisterCard />
          </motion.div>
        </div>
      </main>
    </MouseParallaxProvider>
  );
}
