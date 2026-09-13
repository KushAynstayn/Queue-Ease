"use client";

import {
  FeatureWidgets,
  LoginBackground,
  LoginCard,
  MouseParallaxProvider,
  QueueAnimation,
} from "@/components/login";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <MouseParallaxProvider>

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#081229] via-[#163AAE] to-[#2845D6]">

        <LoginBackground />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-between gap-16 px-6 lg:px-12">

          {/* LEFT */}

          <section className="hidden max-w-xl lg:block">

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.6,
                    delay: 0.3,
                }}
                className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold tracking-wider text-cyan-200 uppercase"
            >
                Queue Ease
            </motion.div>

            <motion.h1
                initial={{
                    opacity: 0,
                    y: 30,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                }}
                className="mt-6 text-6xl font-black leading-tight text-white"
            >
                Smarter Queue
                <br />
                Management
            </motion.h1>

            <motion.p
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.7,
                    delay: 0.8,
                }}
                className="mt-6 text-lg leading-8 text-blue-100"
            >
                AI-powered queue forecasting,
                intelligent analytics,
                and automated SMS notifications
                to improve customer experience.
            </motion.p>

            <FeatureWidgets />

          </section>

          {/* RIGHT */}

          <section className="flex w-full flex-col items-center lg:items-end">

              <LoginCard />

              <div className="mt-8 w-full max-w-md">
                  <QueueAnimation />
              </div>

          </section>
        </div>

      </main>

    </MouseParallaxProvider>
  );
}