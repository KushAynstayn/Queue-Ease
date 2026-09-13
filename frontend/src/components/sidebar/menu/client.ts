import {
  LayoutDashboard,
  Ticket,
  BellRing,
  History,
  UserCircle,
} from "lucide-react";

import { SidebarMenuSection } from "./types";

export const clientMenu: SidebarMenuSection[] = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/client",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "QUEUE",
    items: [
      {
        title: "My Queue",
        href: "/client/queue",
        icon: Ticket,
      },
      {
        title: "Queue History",
        href: "/client/history",
        icon: History,
      },
    ],
  },

  {
    title: "NOTIFICATIONS",
    items: [
      {
        title: "SMS Alerts",
        href: "/client/notifications",
        icon: BellRing,
      },
    ],
  },

  {
    title: "ACCOUNT",
    items: [
      {
        title: "Profile",
        href: "/client/profile",
        icon: UserCircle,
      },
    ],
  },
];