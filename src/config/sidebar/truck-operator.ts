import { SidebarConfig } from "./types";

// Import icons for truck operator
import dashboardIcon from "@assets/svg/dashboard-icon.svg";
import jobManagementIcon from "@assets/svg/d-job-icon.svg";
import teamManagementIcon from "@assets/svg/d-mem-icon.svg";
import billingIcon from "@assets/svg/billing-icon.svg";
import notificationIcon from "@assets/svg/notification.svg";

export const truckOperatorSidebar: SidebarConfig = {
  role: "truck_operator",
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: dashboardIcon,
    },
    {
      id: "available-jobs",
      label: "Available Jobs",
      href: "/jobs/available",
      icon: jobManagementIcon,
    },
    {
      id: "my-jobs",
      label: "My Jobs",
      href: "/jobs/my-jobs",
      icon: jobManagementIcon,
    },
    {
      id: "drivers",
      label: "Drivers",
      href: "/drivers",
      icon: teamManagementIcon,
    },
    {
      id: "trucks",
      label: "Truck Fleet",
      href: "/trucks",
      icon: teamManagementIcon,
    },
    {
      id: "earnings",
      label: "Earnings",
      href: "/earnings",
      icon: billingIcon,
    },
    {
      id: "notifications",
      label: "Notifications",
      href: "/notifications",
      icon: notificationIcon,
      badge: "5", // Example badge
    },
  ],
};
