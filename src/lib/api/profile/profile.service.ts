import axios from "axios";

import apiClient, { ApiResponse } from "@api/client";
import type {
  ProfileData,
  UpdateProfilePayload,
  DeleteAccountPayload,
} from "./profile.types";

export const profileService = {
  // Get profile details
  getProfile: async (): Promise<ProfileData> => {
    try {
      const response = await apiClient.get<ApiResponse<ProfileData>>(
        "/auth/detail"
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch profile");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch profile"
        );
      }
      throw error;
    }
  },

  // Update profile
  updateProfile: async (
    id: string,
    data: UpdateProfilePayload | FormData
  ): Promise<ProfileData> => {
    try {
      const isFormData = data instanceof FormData;
      const response = await apiClient.put<ApiResponse<ProfileData>>(
        `/auth/update/${id}`,
        data,
        isFormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update profile");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update profile"
        );
      }
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (
    id: string,
    data: DeleteAccountPayload
  ): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/auth/delete/${id}`,
        { data }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete account");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete account"
        );
      }
      throw error;
    }
  },
};
