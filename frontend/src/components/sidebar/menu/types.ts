import { LucideIcon } from "lucide-react";

export interface SidebarMenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarMenuSection {
  title: string;
  items: SidebarMenuItem[];
}