// src/queries/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { authService } from "@api/auth/auth.service";

import type { LoginFormData } from "@/lib/schemas/auth.schema";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onError: (err) => {
      // Optional: centralized error handling (toast, analytics)
      // localStorage.removeItem("authToken");
      // alert("2");
      // toast.error(
      //   `An error occurred ${err?.message ? `: ${err?.message}` : ""}`
      // );
      // console.error("Login mutation error:", err);
    },
    onSuccess: (response) => {
      // Optional: set client-side auth state, redirect, etc.
      // e.g., queryClient.setQueryData(['me'], data.user)
      console.log("response", response);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }
      console.log("Logged in:", response);
    },
  });
}
