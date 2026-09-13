import {
  LayoutDashboard,
  Users,
  BarChart3,
  ClipboardList,
  BellRing,
  BrainCircuit,
  ShieldCheck,
  Activity,
  Settings,
} from "lucide-react";

import { SidebarMenuSection } from "./types";

export const adminMenu: SidebarMenuSection[] = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "OPERATIONS",
    items: [
      {
        title: "Queue Monitoring",
        href: "/admin/queue",
        icon: ClipboardList,
      },
      {
        title: "Forecasting",
        href: "/admin/forecasts",
        icon: BrainCircuit,
      },
    ],
  },

  {
    title: "COMMUNICATION",
    items: [
      {
        title: "SMS Notifications",
        href: "/admin/sms",
        icon: BellRing,
      },
    ],
  },

  {
    title: "MANAGEMENT",
    items: [
      {
        title: "Users & Roles",
        href: "/admin/users",
        icon: Users,
      },
    ],
  },

  {
    title: "ANALYTICS",
    items: [
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Reports",
        href: "/admin/reports",
        icon: ClipboardList,
      },
    ],
  },

  {
    title: "SYSTEM",
    items: [
      {
        title: "Activity Logs",
        href: "/admin/logs",
        icon: Activity,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];