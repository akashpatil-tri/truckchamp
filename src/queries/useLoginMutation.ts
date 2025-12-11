// src/queries/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@api/auth/auth.service";
import type { LoginFormData } from "@/lib/schemas/auth.schema";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginFormData) => loginApi(data),
    onError: (err) => {
      // Optional: centralized error handling (toast, analytics)
      console.error("Login mutation error:", err);
    },
    onSuccess: (data) => {
      // Optional: set client-side auth state, redirect, etc.
      // e.g., queryClient.setQueryData(['me'], data.user)
      console.log("Logged in:", data);
    },
  });
}
