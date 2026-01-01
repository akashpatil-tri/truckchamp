import axios from "axios";

import apiClient, { ApiResponse } from "@api/client";
import type { TeamMember } from "@/types/team-member.types";

export const teamMemberService = {
  // Create team member
  create: async (data: FormData): Promise<TeamMember> => {
    try {
      const response = await apiClient.post<ApiResponse<TeamMember>>(
        "/team-member/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create team member");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to create team member"
        );
      }
      throw error;
    }
  },

  // Update team member
  update: async (id: string, data: FormData): Promise<TeamMember> => {
    try {
      const response = await apiClient.post<ApiResponse<TeamMember>>(
        `/team-member/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update team member");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update team member"
        );
      }
      throw error;
    }
  },

  // List team members
  list: async (searchTerm?: string): Promise<TeamMember[]> => {
    try {
      const params: Record<string, string> = {};
      if (searchTerm?.trim()) {
        params.search = searchTerm;
      }

      const response = await apiClient.get<ApiResponse<TeamMember[]>>(
        "/team-member/list",
        { params }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch team members");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch team members"
        );
      }
      throw error;
    }
  },

  // Delete team member
  delete: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/team-member/delete/${id}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete team member");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete team member"
        );
      }
      throw error;
    }
  },
};
