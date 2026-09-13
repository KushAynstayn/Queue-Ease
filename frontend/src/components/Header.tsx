"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "#home",
    id: "home",
  },
  {
    label: "Features",
    href: "#features",
    id: "features",
  },
  {
    label: "How It Works",
    href: "#how-it-works",
    id: "how-it-works",
  },
  {
    label: "Benefits",
    href: "#benefits",
    id: "benefits",
  },
  {
    label: "Get Started",
    href: "#cta",
    id: "cta",
  },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("home");

  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/client");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id], main[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-white/10 bg-[#2845D6]/95 backdrop-blur-md shadow-lg">
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 md:px-8 lg:px-12">

        {/* LEFT */}

        <Link href="/" className="group">
          <Image
            src="/images/ease.png"
            alt="Queue Ease"
            width={180}
            height={60}
            priority
            className="h-14 w-auto transition duration-300 group-hover:scale-105"
          />
        </Link>

        {/* CENTER */}

        {!isDashboard && (
          <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <ul className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
              {navItems.map((item) => {
                const active = activeSection === item.id;

                return (
                  <li key={item.id} className="relative">
                    <Link
                      href={item.href}
                      className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition duration-300 ${
                        active
                          ? "text-[#2845D6]"
                          : "text-white hover:text-blue-100"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="active-pill"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                          className="absolute inset-0 -z-10 rounded-full bg-white"
                        />
                      )}

                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* RIGHT */}

        <Link
          href="https://www.ctu.edu.ph/"
          target="_blank"
        >
          <Image
            src="/images/ctu_logo.png"
            alt="CTU Logo"
            width={50}
            height={50}
            className="h-11 w-11 transition duration-300 hover:scale-110"
          />
        </Link>

      </div>
    </header>
  );
}