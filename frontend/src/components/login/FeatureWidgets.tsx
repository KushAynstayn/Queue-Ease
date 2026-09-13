"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BellRing,
  BrainCircuit,
} from "lucide-react";

const cards = [
  {
    title: "Forecast Accuracy",
    value: "96%",
    icon: BrainCircuit,
    color: "text-cyan-300",
  },
  {
    title: "SMS Delivered",
    value: "1,482",
    icon: BellRing,
    color: "text-green-300",
  },
  {
    title: "Current Wait",
    value: "12 min",
    icon: Activity,
    color: "text-yellow-300",
  },
];

export default function FeatureWidgets() {
  return (
    <div className="mt-14 grid gap-5">

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: .35 + index * .15,
            }}
            whileHover={{
              y: -5,
              scale: 1.02,
            }}
            className="group rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl transition"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-blue-100">
                  {card.title}
                </p>

                <motion.h3
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="mt-2 text-3xl font-bold text-white"
                >
                  {card.value}
                </motion.h3>

              </div>

              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="rounded-xl bg-white/10 p-4"
              >
                <Icon
                  size={26}
                  className={card.color}
                />
              </motion.div>

            </div>

            {/* Progress */}

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">

              <motion.div
                animate={{
                  width: ["35%", "90%", "70%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
              />

            </div>

          </motion.div>
        );
      })}
    </div>
  );
}