"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Forecasting",
    description:
      "Predict queue demand and peak service hours using historical transaction data and intelligent forecasting.",
    image: "/images/forecast.jpg",
  },
  {
    title: "Queue Monitoring",
    description:
      "Monitor queues in real time and manage customer flow efficiently through an intuitive dashboard.",
    image: "/images/monitoring.jpg",
  },
  {
    title: "SMS Notifications",
    description:
      "Automatically notify clients about their queue status, estimated waiting time, and service updates.",
    image: "/images/notif.jpg",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Visualize service performance, queue statistics, and forecasting insights through interactive analytics.",
    image: "/images/dash.jpg",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white py-24"
    >
      {/* Background */}

      <div className="absolute inset-0 hero-grid opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-[#2845D6]">
            Powerful Features
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
            Everything You Need for
            <span className="gradient-text"> Smarter Queue Management</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Queue Ease combines Artificial Intelligence, automation,
            and real-time monitoring to deliver a faster,
            more organized, and more efficient service experience.
          </p>
        </motion.div>

        {/* Cards */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-blue-100
                bg-white
                p-8
                shadow-lg
                transition-all
                duration-300
                hover:border-[#2845D6]
                hover:shadow-2xl
              "
            >
              {/* Glow */}

              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 via-blue-100/0 to-[#2845D6]/5 opacity-0 transition duration-500 group-hover:opacity-100" />

              {/* Image */}

              <div className="relative mb-8 flex h-36 items-center justify-center">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={180}
                  height={180}
                  className="h-full w-auto object-contain transition duration-300 group-hover:scale-110"
                />
              </div>

              {/* Title */}

              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                {feature.title}
              </h3>

              {/* Description */}

              <p className="leading-7 text-slate-600">
                {feature.description}
              </p>

              {/* Bottom Accent */}

              <div className="mt-8 h-1 w-0 rounded-full bg-[#2845D6] transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}