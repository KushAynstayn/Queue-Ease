import {
  LayoutDashboard,
  ClipboardList,
  BrainCircuit,
  BellRing,
  FileBarChart,
  UserCircle,
} from "lucide-react";

import { SidebarMenuSection } from "./types";

export const staffMenu: SidebarMenuSection[] = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/staff",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "OPERATIONS",
    items: [
      {
        title: "Queue Management",
        href: "/staff/queue",
        icon: ClipboardList,
      },
      {
        title: "Forecasts",
        href: "/staff/forecasts",
        icon: BrainCircuit,
      },
    ],
  },

  {
    title: "COMMUNICATION",
    items: [
      {
        title: "SMS Notifications",
        href: "/staff/sms",
        icon: BellRing,
      },
    ],
  },

  {
    title: "REPORTS",
    items: [
      {
        title: "Reports",
        href: "/staff/reports",
        icon: FileBarChart,
      },
    ],
  },

  {
    title: "ACCOUNT",
    items: [
      {
        title: "Profile",
        href: "/staff/profile",
        icon: UserCircle,
      },
    ],
  },
];