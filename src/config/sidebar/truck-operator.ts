
import jobManagementIcon from "@assets/svg/d-job-icon.svg";
import teamManagementIcon from "@assets/svg/d-mem-icon.svg";
import dashboardIcon from "@assets/svg/dashboard-icon.svg";
import driverManagementIcon from "@assets/svg/driver-management.svg"
import fleetManagementIcon from "@assets/svg/fleet-management.svg"
import scheduleIcon from "@assets/svg/schedule.svg"

import { SidebarConfig } from "./types";

export const truckOperatorSidebar: SidebarConfig = {
  role: "truck_operator",
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/truck-operator/dashboard",
      icon: dashboardIcon,
    },
    {
      id: "job-feed",
      label: "Job Feed",
      href: "/truck-operator/job-feed",
      icon: jobManagementIcon,
    },
    {
      id: "job-management",
      label: "Job Management",
      href: "/truck-operator/job-management",
      icon: jobManagementIcon,
    },
    {
      id: "manage-team-members",
      label: "Manage Team Members",
      href: "/truck-operator/team-members",
      icon: teamManagementIcon,
    },
    {
      id: "fleet-management",
      label: "Fleet Management",
      href: "/truck-operator/fleet-management",
      icon: fleetManagementIcon,
    },
    {
      id: "driver-management",
      label: "Driver Management",
      href: "/truck-operator/drivers",
      icon: driverManagementIcon,
    },
    {
      id: "schedule",
      label: "Schedule",
      href: "/truck-operator/schedule",
      icon: scheduleIcon,
    },
  ],
};
