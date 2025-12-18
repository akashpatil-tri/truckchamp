import { SidebarConfig, UserRole } from "./types";
import { constructionAdminSidebar } from "./construction-admin";
import { truckOperatorSidebar } from "./truck-operator";
import { superAdminSidebar } from "./super-admin";

// Map of all sidebar configurations
const sidebarConfigs: Record<UserRole, SidebarConfig> = {
  construction_admin: constructionAdminSidebar,
  truck_operator: truckOperatorSidebar,
  super_admin: superAdminSidebar,
};

/**
 * Get sidebar configuration based on user role
 * @param role - User role
 * @returns Sidebar configuration for the role
 */
export function getSidebarConfig(role: UserRole): SidebarConfig {
  return sidebarConfigs[role] || constructionAdminSidebar; // Default fallback
}

// Export individual configs if needed
export { constructionAdminSidebar, truckOperatorSidebar, superAdminSidebar };
export type { SidebarConfig, UserRole, SidebarItem } from "./types";
