"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useMouseParallax } from "./MouseParallax";

export default function ForecastGraph() {
  const { x, y } = useMouseParallax();

  const points = useMemo(
    () => [
      [10, 110],
      [70, 80],
      [120, 95],
      [180, 45],
      [240, 70],
      [300, 25],
      [360, 55],
    ],
    []
  );

  const path = points
    .map(([px, py], index) =>
      `${index === 0 ? "M" : "L"} ${px} ${py}`
    )
    .join(" ");

  return (
    <motion.div
      animate={{
        x: x * 10,
        y: y * 10,
      }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 20,
      }}
      className="absolute left-12 top-32 opacity-70"
    >
      <svg
        width="380"
        height="140"
        viewBox="0 0 380 140"
        fill="none"
      >
        <defs>
          <linearGradient
            id="forecastGradient"
            x1="0"
            y1="0"
            x2="380"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#FFFFFF"
            />
            <stop
              offset="100%"
              stopColor="#7DD3FC"
            />
          </linearGradient>
        </defs>

        <motion.path
          d={path}
          stroke="url(#forecastGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {points.map(([cx, cy], index) => (
          <motion.circle
            key={index}
            cx={cx}
            cy={cy}
            r="5"
            fill="#fff"
            animate={{
              scale: [1, 1.4, 1],
            }}
            transition={{
              delay: index * .2,
              duration: 2,
              repeat: Infinity,
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}