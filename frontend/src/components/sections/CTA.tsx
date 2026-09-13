"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-[#121358] py-24">

      {/* Background Glow */}

      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="absolute inset-0 hero-grid opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: .96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: .7 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-5xl px-6 text-center"
      >
        {/* Badge */}

        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
          <Sparkles size={18} />
          AI-Powered Queue Management
        </div>

        {/* Heading */}

        <h2 className="mt-8 text-4xl font-black leading-tight text-white md:text-6xl">
          Ready to Experience
          <br />
          Smarter Queue Management?
        </h2>

        {/* Description */}

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-blue-100">
          Reduce waiting time, improve service efficiency,
          and provide a better client experience through
          AI-powered forecasting, queue monitoring,
          and automated SMS notifications.
        </p>

        {/* Buttons */}

        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

          <Link
            href="/login"
            className="
              group
              inline-flex
              items-center
              gap-3
              rounded-xl
              bg-white
              px-8
              py-4
              text-lg
              font-semibold
              text-[#2845D6]
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:scale-105
            "
          >
            Login to Queue Ease

            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="#features"
            className="
              rounded-xl
              border
              border-white/30
              px-8
              py-4
              text-lg
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-white/10
            "
          >
            Learn More
          </Link>

        </div>

        {/* Bottom Stats */}

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"
          >
            <h3 className="text-3xl font-black text-white">
              AI
            </h3>

            <p className="mt-2 text-blue-100">
              Intelligent Forecasting
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"
          >
            <h3 className="text-3xl font-black text-white">
              SMS
            </h3>

            <p className="mt-2 text-blue-100">
              Real-Time Notifications
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"
          >
            <h3 className="text-3xl font-black text-white">
              Analytics
            </h3>

            <p className="mt-2 text-blue-100">
              Smarter Decisions
            </p>
          </motion.div>

        </div>

      </motion.div>

    </section>
  );
}