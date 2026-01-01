// Import icons for super admin
import billingIcon from "@assets/svg/billing-icon.svg";
import dashboardIcon from "@assets/svg/dashboard-icon.svg";
import jobManagementIcon from "@assets/svg/job-management-icon.svg";
import notificationIcon from "@assets/svg/notification.svg";
import teamManagementIcon from "@assets/svg/team-management-icon.svg";

import { SidebarConfig } from "./types";

export const superAdminSidebar: SidebarConfig = {
  role: "super_admin",
  items: [
    {
      id: "dashboard",
      label: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: dashboardIcon,
    },
    {
      id: "users",
      label: "User Management",
      href: "/admin/users",
      icon: teamManagementIcon,
    },
    {
      id: "construction-companies",
      label: "Construction Companies",
      href: "/admin/construction-companies",
      icon: jobManagementIcon,
    },
    {
      id: "truck-operators",
      label: "Truck Operators",
      href: "/admin/truck-operators",
      icon: jobManagementIcon,
    },
    {
      id: "jobs",
      label: "All Jobs",
      href: "/admin/jobs",
      icon: jobManagementIcon,
    },
    {
      id: "payments",
      label: "Payments & Transactions",
      href: "/admin/payments",
      icon: billingIcon,
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      href: "/admin/reports",
      icon: dashboardIcon,
    },
    {
      id: "system-settings",
      label: "System Settings",
      href: "/admin/settings",
      icon: notificationIcon,
    },
  ],
};
