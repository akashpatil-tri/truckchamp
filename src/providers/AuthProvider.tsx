"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useRouter, usePathname } from "next/navigation";

import { authService } from "@api/auth/auth.service";
import { getRoleBasedDashboard } from "@lib/utils/auth.utils";

import type { User } from "@api/auth/auth.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const fetchUser = useCallback(async () => {
    // Skip fetching user on public routes when not authenticated
    if (isPublicRoute) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch {
      setUser(null);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [isPublicRoute, router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Continue with logout even if API fails
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await fetchUser();
  }, [fetchUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper hook to get role-based redirect
export function useRoleRedirect() {
  const { user } = useAuth();

  const getDashboardPath = useCallback(() => {
    if (!user?.role) return "/login";
    return getRoleBasedDashboard(user.role);
  }, [user]);

  return { getDashboardPath };
}
