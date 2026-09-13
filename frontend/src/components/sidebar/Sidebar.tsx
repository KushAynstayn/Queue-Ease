"use client";

import { useMemo, useState } from "react";
import { Menu, ChevronLeft, ChevronRight, X } from "lucide-react";

import SidebarLogo from "./SidebarLogo";
import SidebarSection from "./SidebarSection";

import { adminMenu } from "./menu/admin";
import { staffMenu } from "./menu/staff";
import { clientMenu } from "./menu/client";

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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          left-4
          top-[82px]
          z-50
          rounded-lg
          bg-white
          p-2
          shadow-lg
          lg:hidden
        "
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            lg:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-[68px]
          left-0
          z-50
          flex
          h-[calc(100vh-68px)]
          flex-col
          border-r
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          duration-300
          ${collapsed ? "w-24" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile Close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="
            absolute
            right-4
            top-5
            lg:hidden
          "
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <SidebarLogo collapsed={collapsed} role={role} />

        {/* Navigation */}
        <nav
          className="
            flex-1
            overflow-y-auto
            py-6
          "
        >
          {menu.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Collapse */}
        <div
          className="
            border-t
            border-slate-200
            p-4
          "
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              flex
              w-full
              items-center
              justify-center
              rounded-lg
              bg-slate-100
              py-2
              transition
              hover:bg-slate-200
            "
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