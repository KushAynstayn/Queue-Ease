"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/sidebar/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "staff" | "client";
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Header />

      <div className="flex pt-[68px] min-h-screen">
        <Sidebar role={role} collapsed={collapsed} setCollapsed={setCollapsed} />

        <main
          className={`
            flex-1
            bg-slate-50
            p-4 md:p-6 lg:p-8
            transition-all
            duration-300
            ${collapsed ? "lg:ml-24" : "lg:ml-72"}
          `}
        >
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}