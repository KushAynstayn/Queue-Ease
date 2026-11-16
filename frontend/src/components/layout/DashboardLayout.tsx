
"use client";

import { useState } from "react";
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
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role={role}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`
          min-h-screen bg-slate-50
          p-4 pt-16 md:p-6 md:pt-16 lg:pt-8
          transition-all duration-300
          ${collapsed ? "lg:ml-24" : "lg:ml-72"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
