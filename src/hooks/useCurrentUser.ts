"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@api/auth/auth.service";
import type { User } from "@api/auth/auth.types";

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["current-user"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
