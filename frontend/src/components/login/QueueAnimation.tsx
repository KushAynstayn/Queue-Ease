"use client";

import { motion } from "framer-motion";
import { UserRound, Building2 } from "lucide-react";
import { useMouseParallax } from "./MouseParallax";

const people = [0, 1, 2, 3, 4];

export default function QueueAnimation() {
  const { x, y } = useMouseParallax();

  return (
    <motion.div
    initial={{
        opacity: 0,
        y: 30,
        scale: 0.96,
    }}
    animate={{
        opacity: 1,
        y: y * 3,
        x: x * 5,
        scale: 1,
    }}
    transition={{
        opacity: {
        duration: 0.7,
        delay: 1.3,
        },
        y: {
        type: "spring",
        stiffness: 40,
        damping: 20,
        delay: 1.3,
        },
        x: {
        type: "spring",
        stiffness: 40,
        damping: 20,
        delay: 1.3,
        },
        scale: {
        duration: 0.7,
        delay: 1.3,
        },
    }}
    className="w-full mt-10 ml-10"
    >
      <div className="mb-5 flex items-center justify-between">

        <div className="text-sm font-semibold tracking-wider text-blue-100 uppercase">
          Live Queue
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </div>

      </div>

      <div className="relative h-20">

        {/* Queue Line */}

        <div className="absolute left-0 right-12 top-10 h-[2px] bg-white/20" />

        {/* Service Counter */}

        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute right-0 top-0 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg"
        >
          <Building2
            size={32}
            className="text-cyan-300"
          />
        </motion.div>

        {/* Moving Users */}

        {people.map((person, index) => (
          <motion.div
            key={person}
            initial={{
              x: -50 - index * 55,
            }}
            animate={{
              x: 320,
            }}
            transition={{
              duration: 7,
              ease: "linear",
              repeat: Infinity,
              delay: index * 1.25,
            }}
            className="absolute top-4"
          >
            <div className="rounded-full border border-white/20 bg-white/15 p-2 backdrop-blur">
              <UserRound
                size={18}
                className="text-white"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}