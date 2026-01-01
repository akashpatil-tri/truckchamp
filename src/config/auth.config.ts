import type { UserRole } from "@api/auth/auth.types";

// Centralized auth configuration to avoid duplication across middleware and providers

// Routes that don't require authentication
export const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"] as const;

// Routes that should redirect to dashboard if already authenticated
export const AUTH_ROUTES = ["/login", "/register", "/forgot-password"] as const;

// Role-based dashboard routes
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  construction_admin: "/construction-admin/dashboard",
  operator_admin: "/truck-operator/dashboard",
  super_admin: "/admin/dashboard",
} as const;

// Default dashboard for when role is unknown (middleware can't decode JWT)
export const DEFAULT_DASHBOARD = "/dashboard";

// Cookie names
export const AUTH_COOKIE_NAME = "authToken";
export const USER_ROLE_COOKIE_NAME = "userRole";

// Session storage keys
export const AUTH_REDIRECT_KEY = "auth_redirect_attempted";

// Helper functions
export function isPublicPath(path: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

export function isAuthPath(path: string): boolean {
  return AUTH_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

export function getRoleBasedDashboard(role: UserRole | undefined | null): string {
  if (!role) return "/login";
  return ROLE_DASHBOARD_ROUTES[role] || DEFAULT_DASHBOARD;
}

export function getRoleBasedLoginRoute(role: UserRole): string {
  return role === "super_admin" ? "/admin/login" : "/login";
}
