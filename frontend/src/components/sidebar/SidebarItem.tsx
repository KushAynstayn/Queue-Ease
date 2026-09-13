"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { SidebarMenuItem } from "./menu/types";

interface SidebarItemProps {
  item: SidebarMenuItem;
  collapsed?: boolean;
}

export default function SidebarItem({
  item,
  collapsed = false,
}: SidebarItemProps) {
  const pathname = usePathname();

  const isBaseRoute = item.href === "/admin" || item.href === "/staff" || item.href === "/client";
  
  const active = isBaseRoute 
    ? pathname === item.href 
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={clsx(
        "group flex items-center rounded-xl transition-all duration-200",
        "mx-3 px-4 py-3",
        active
          ? "bg-[#2845D6] text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100 hover:text-[#2845D6]"
      )}
    >
      <Icon
        size={20}
        className={clsx(
          "flex-shrink-0",
          active
            ? "text-white"
            : "text-slate-500 group-hover:text-[#2845D6]"
        )}
      />

      {!collapsed && (
        <span className="ml-3 font-medium">
          {item.title}
        </span>
      )}
    </Link>
  );
}