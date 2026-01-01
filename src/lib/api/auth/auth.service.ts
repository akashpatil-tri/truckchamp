import axios from "axios";

import {
  User,
  type LoginRequest,
  type LoginResponse,
} from "@api/auth/auth.types";
import apiClient, { ApiResponse } from "@api/client";

export const authService = {
  // Login - backend sets HttpOnly cookie
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  },

  // Logout - backend clears HttpOnly cookie
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  },

  // Reset password
  resetPassword: async (
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  },

  // Validate token
  validateToken: async (token: string): Promise<unknown> => {
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/auth/validate-token",
        { token }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Token validation failed");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Token validation failed"
        );
      }
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>("/auth/me");

      if (!response.data.success) {
        throw new Error(response.data.message || "Token validation failed");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Token validation failed"
        );
      }
      throw error;
    }
  },
};
