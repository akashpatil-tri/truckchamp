
// Import icons for construction admin
import billingIcon from "@assets/svg/billing-icon.svg";
import dashboardIcon from "@assets/svg/dashboard-icon.svg";
import jobManagementIcon from "@assets/svg/job-management-icon.svg";
import ratingIcon from "@assets/svg/rating-icon.svg";
import teamManagementIcon from "@assets/svg/team-management-icon.svg";

import { SidebarConfig } from "./types";

export const constructionAdminSidebar: SidebarConfig = {
  role: "construction_admin",
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/construction-admin/dashboard",
      icon: dashboardIcon,
    },
    {
      id: "job-management",
      label: "Job Management",
      href: "/construction-admin/dashboard",
      icon: jobManagementIcon,
    },
    {
      id: "team-management",
      label: "Team Management",
      href: "/team",
      icon: teamManagementIcon,
    },
    {
      id: "billing",
      label: "Billing & Invoicing",
      href: "/billing",
      icon: billingIcon,
    },
    {
      id: "ratings",
      label: "Rating & Reviews",
      href: "/ratings",
      icon: ratingIcon,
    },
  ],
};
