import apiClient, { ApiResponse } from "../client";

import { User, type LoginRequest, type LoginResponse } from "./auth.types";

export const authService = {
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data
    );
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password", { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post("/auth/reset-password", { token, password });
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },
};
