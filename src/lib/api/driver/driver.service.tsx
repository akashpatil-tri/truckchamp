import axios from "axios";

import apiClient, { ApiResponse } from "@api/client";

import type { Driver } from "@/types/driver.types";

export interface DriversListResponse {
  data: Driver[];
  hasMore: boolean;
}

export const driverService = {
  createDriver: async (data: any): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        "/driver/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create driver");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to create driver"
        );
      }
      throw error;
    }
  },

  list: async (): Promise<any> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>("/driver/list");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch drivers");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch drivers"
        );
      }
      throw error;
    }
  },

  deleteDriver: async (id: string): Promise<any> => {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(
        `/driver/delete/${id}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete driver");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete driver"
        );
      }
      throw error;
    }
  },
};

export const loadDriversList = async (
  page: number = 1,
  searchTerm: string = ""
): Promise<DriversListResponse> => {
  try {
    const params: Record<string, string | number> = {
      page: page || 1,
      limit: 10,
    };

    if (searchTerm?.trim()) {
      params.search = searchTerm;
    }

    const response = await apiClient.get("/driver/list", { params });

    const drivers = response?.data?.data?.data || [];
    const hasMore = response?.data?.data?.hasMore || false;

    return {
      data: drivers,
      hasMore,
    };
  } catch (error) {
    console.error("Failed to fetch drivers list:", error);
    return {
      data: [],
      hasMore: false,
    };
  }
};
