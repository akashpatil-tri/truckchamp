import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { authService } from "@api/auth/auth.service";

import type { LoginFormData } from "@/lib/schemas/auth.schema";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onError: (err) => {
      toast.error(err?.message || "Login failed");
    },
    // Note: Cookie is set by backend, user data returned in response
    // Use AuthContext's login() to store user data after successful login
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onError: (err) => {
      toast.error(
        `An error occurred ${err?.message ? `: ${err?.message}` : ""}`
      );
    },
    onSuccess: () => {
      toast.success("Password reset email sent successfully.");
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({
      token,
      password,
      confirmPassword,
    }: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => authService.resetPassword(token, password, confirmPassword),
    onError: (err) => {
      toast.error(err?.message || "Reset Password failed");
    },
    onSuccess: () => {
      toast.success("Password reset successfully.");
    },
  });
}
