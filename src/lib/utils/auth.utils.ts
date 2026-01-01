import { UserRole } from "@api/auth/auth.types";

export function getRoleBasedDashboard(role: UserRole): string {
  const roleRoutes: Record<UserRole, string> = {
    construction_admin: "/construction-admin/dashboard",
    operator_admin: "/truck-operator/dashboard",
    super_admin: "/admin/dashboard",
  };

  return roleRoutes[role] || "/login";
}

export function getRoleBasedLoginRoute(role: UserRole): string {
  return role === "super_admin" ? "/admin/login" : "/login";
}
