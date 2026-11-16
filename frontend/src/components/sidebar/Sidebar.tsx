
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from "lucide-react";

import SidebarLogo from "./SidebarLogo";
import SidebarSection from "./SidebarSection";
import { adminMenu } from "./menu/admin";
import { staffMenu } from "./menu/staff";
import { clientMenu } from "./menu/client";
import { apiRequest } from "@/lib/api";

interface SidebarProps {
  role: "admin" | "staff" | "client";
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  role,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menu = useMemo(() => {
    switch (role) {
      case "staff":
        return staffMenu;
      case "client":
        return clientMenu;
      default:
        return adminMenu;
    }
  }, [role]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Ask Laravel to revoke the current Sanctum token.
      await apiRequest<unknown>("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      // Still clear local credentials if the API is unavailable
      // or the token has already expired.
      console.error("Logout API request failed:", error);
    } finally {
      // Remove credentials from both storage locations.
      if (typeof window !== "undefined") {
        localStorage.removeItem("queue_ease_token");
        localStorage.removeItem("queue_ease_user");
        sessionStorage.removeItem("queue_ease_token");
        sessionStorage.removeItem("queue_ease_user");
      }

      // Return to the public login page.
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
        aria-expanded={mobileOpen}
        className="fixed left-4 top-4 z-[60] rounded-lg bg-white p-2 shadow-lg lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-[70]
          flex h-screen flex-col
          border-r border-slate-200 bg-white shadow-sm
          transition-all duration-300
          ${collapsed ? "w-24" : "w-72"}
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          className="absolute right-4 top-5 lg:hidden"
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <SidebarLogo collapsed={collapsed} role={role} />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          {menu.map((section) => (
            <div
              key={section.title}
              onClick={() => setMobileOpen(false)}
            >
              <SidebarSection
                section={section}
                collapsed={collapsed}
              />
            </div>
          ))}
        </nav>

        {/* Logout and collapse controls */}
        <div className="space-y-3 border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={collapsed ? "Logout" : undefined}
            className={`
              flex w-full items-center rounded-lg
              border border-red-100 px-3 py-2.5
              text-red-600 transition
              hover:bg-red-50
              disabled:cursor-not-allowed disabled:opacity-60
              ${collapsed ? "justify-center" : "justify-start gap-3"}
            `}
          >
            <LogOut size={19} className="shrink-0" />
            {!collapsed && (
              <span className="font-medium">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center justify-center rounded-lg bg-slate-100 py-2 transition hover:bg-slate-200"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
