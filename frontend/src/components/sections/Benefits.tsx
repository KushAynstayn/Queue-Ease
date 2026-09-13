"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  BarChart3,
  BellRing,
  BrainCircuit,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: Clock3,
    title: "Reduce Waiting Time",
    description:
      "Forecast queue demand to minimize long waiting lines and improve service flow.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Forecasting",
    description:
      "Use historical queue data to predict peak hours and improve staff scheduling.",
  },
  {
    icon: BellRing,
    title: "Automated SMS Alerts",
    description:
      "Notify clients automatically when their turn is approaching.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    description:
      "Gain insights through reports, analytics, and forecasting dashboards.",
  },
  {
    icon: Users,
    title: "Better Client Experience",
    description:
      "Create a smoother and more convenient queueing experience.",
  },
  {
    icon: CheckCircle2,
    title: "Higher Service Efficiency",
    description:
      "Help staff serve more clients while reducing congestion.",
  },
];

const stats = [
  {
    value: "50%",
    label: "Reduced Waiting Time",
  },
  {
    value: "24/7",
    label: "Queue Monitoring",
  },
  {
    value: "100%",
    label: "SMS Automation",
  },
];

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-white py-24"
    >
      <div className="absolute inset-0 hero-grid opacity-30" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Image
            src="/images/benefits.jpg"
            alt="Benefits Illustration"
            width={600}
            height={600}
            className="animate-float w-full max-w-[520px] object-contain"
          />
        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-[#2845D6]">
            Why Choose Queue Ease
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
            Smarter Queues,
            <span className="gradient-text"> Better Service.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Queue Ease combines Artificial Intelligence, queue monitoring,
            forecasting, and SMS notifications into one platform that helps
            organizations deliver faster, more efficient, and more reliable
            customer service.
          </p>

          {/* Benefits */}

          <div className="mt-10 grid gap-6">

            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * .08,
                    duration: .45,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    x: 8,
                  }}
                  className="flex gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:border-[#2845D6] hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    <Icon
                      size={24}
                      className="text-[#2845D6]"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 leading-7 text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

          </div>

          {/* Statistics */}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: .4 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-3 gap-5"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-[#2845D6] p-6 text-center text-white shadow-xl"
              >
                <div className="text-3xl font-black">
                  {stat.value}
                </div>

                <div className="mt-2 text-sm text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}