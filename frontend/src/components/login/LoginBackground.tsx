"use client";

import { motion } from "framer-motion";
import ForecastGraph from "./ForecastGraph";
import { useMouseParallax } from "./MouseParallax";

export default function LoginBackground() {
  const { x, y } = useMouseParallax();

  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Grid */}

      <motion.div
        animate={{
          x: x * 6,
          y: y * 6,
        }}
        transition={{
          type: "spring",
          stiffness: 30,
        }}
        className="absolute inset-0 opacity-[0.05]
        bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
        bg-[size:48px_48px]"
      />

      {/* Top Blur */}

      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
        }}
        style={{
          translateX: x * 20,
          translateY: y * 20,
        }}
        className="absolute
        -left-44
        -top-36
        h-[520px]
        w-[520px]
        rounded-full
        bg-cyan-400/20
        blur-[140px]"
      />

      {/* Bottom Blur */}

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
        }}
        style={{
          translateX: x * 30,
          translateY: y * 30,
        }}
        className="absolute
        bottom-0
        right-0
        h-[520px]
        w-[520px]
        rounded-full
        bg-indigo-500/20
        blur-[170px]"
      />

      {/* Forecast */}

      <ForecastGraph />

    </div>
  );
}