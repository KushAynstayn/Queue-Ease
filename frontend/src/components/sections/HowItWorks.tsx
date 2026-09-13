"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Request Queue",
    description:
      "Clients register for a queue through the Queue Ease system and receive their queue number instantly.",
    image: "/images/request.png",
  },
  {
    number: "02",
    title: "AI Predicts",
    description:
      "Historical queue data is analyzed to estimate waiting time and forecast upcoming demand.",
    image: "/images/predicts.png",
  },
  {
    number: "03",
    title: "Receive SMS",
    description:
      "Clients receive automated SMS notifications informing them when their turn is approaching.",
    image: "/images/sms.png",
  },
  {
    number: "04",
    title: "Get Served",
    description:
      "Clients arrive at the right time, reducing waiting time while improving service efficiency.",
    image: "/images/served.png",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-50 py-24"
    >
      {/* Background */}

      <div className="absolute inset-0 hero-grid opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-[#2845D6]">
            How It Works
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
            Four Simple Steps to a
            <span className="gradient-text"> Better Queue Experience</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Queue Ease streamlines every stage of the queueing process,
            from registration to service completion,
            ensuring a faster and more organized experience.
          </p>
        </motion.div>

        {/* Timeline */}

        <div className="relative">

          {/* Desktop Line */}

          <div className="absolute left-0 right-0 top-12 hidden h-1 bg-blue-100 lg:block" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: .25,
                },
              },
            }}
            className="grid gap-12 lg:grid-cols-4"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 50,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                transition={{
                  duration: .6,
                }}
                className="relative text-center"
              >
                {/* Timeline Circle */}

                <motion.div
                  whileHover={{
                    scale: 1.1,
                  }}
                  className="
                    relative
                    z-10
                    mx-auto
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    bg-[#2845D6]
                    text-2xl
                    font-black
                    text-white
                    shadow-xl
                  "
                >
                  {step.number}
                </motion.div>

                {/* Image */}

                <div className="mt-10 flex justify-center">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={170}
                    height={170}
                    className="h-36 w-auto object-contain transition duration-300 hover:scale-110"
                  />
                </div>

                {/* Title */}

                <h3 className="mt-8 text-2xl font-bold text-slate-900">
                  {step.title}
                </h3>

                {/* Description */}

                <p className="mt-4 leading-7 text-slate-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}