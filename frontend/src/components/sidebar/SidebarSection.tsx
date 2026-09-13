"use client";

import SidebarItem from "./SidebarItem";
import { SidebarMenuSection } from "./menu/types";

interface SidebarSectionProps {
  section: SidebarMenuSection;
  collapsed?: boolean;
}

export default function SidebarSection({
  section,
  collapsed = false,
}: SidebarSectionProps) {
  return (
    <div className="mb-6">
      {!collapsed && (
        <h3 className="px-6 mb-2 text-xs font-semibold tracking-widest uppercase text-slate-400">
          {section.title}
        </h3>
      )}

      <div className="space-y-1">
        {section.items.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}