"use client";

import Image from "next/image";
import Link from "next/link";

interface SidebarLogoProps {
  collapsed?: boolean;
  role: "admin" | "staff" | "client";
}

export default function SidebarLogo({
  collapsed = false,
  role,
}: SidebarLogoProps) {
  return (
    <Link
      href={`/${role}`}
      className="flex items-center gap-3 px-5 py-5 border-b border-slate-200"
    >
      <Image
        src="/images/img.png"
        alt="Queue Ease"
        width={40}
        height={40}
        className="rounded-lg"
      />

      {!collapsed && (
        <div className="leading-tight">
          <h1 className="font-bold text-slate-800">Queue Ease</h1>
          <p className="text-xs text-slate-500 capitalize">{role} Panel</p>
        </div>
      )}
    </Link>
  );
}