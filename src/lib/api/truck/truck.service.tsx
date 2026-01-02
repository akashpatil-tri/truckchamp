import axios from "axios";
import Image from "next/image";

import apiClient, { ApiResponse } from "@api/client";
import { EquipmentListResponse } from "@api/truck/truck.types";
import { DropdownOption } from "@common/Dropdown";

const NEXT_BACKEND_SERVER_URL =
  process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "";

export const truckService = {
  getAllTruckTypes: async () => {
    try {
      const response = await apiClient.get<ApiResponse<EquipmentListResponse>>(
        "/truck-type/list",
        { params: { limit: 20 } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Truck type fetch failed");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Truck type fetch failed"
        );
      }
      throw error;
    }
  },
  getTruckProperties: async (truckTypeId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<unknown>>(
        `/truck-type/${truckTypeId}`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Truck properties fetch failed"
        );
      }

      return response.data.data || [];
    } catch (error) {
      console.error("Failed to get truck properties:", error);
      return [];
    }
  },
};

export const getTruckProperties = async (truckTypeId: string) => {
  try {
    const response = await apiClient.get(`/truck-type/${truckTypeId}`);
    console.log("response", response);

    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to get truck properties:", error);
    return [];
  }
};

export const loadTruckTypes = async (
  page: number = 1,
  searchTerm: string = ""
): Promise<{ data: DropdownOption[]; hasMore: boolean }> => {
  try {
    const params: Record<string, string | number> = {
      page: page || 1,
      limit: 10,
    };

    if (searchTerm?.trim()) {
      params.search = searchTerm;
    }

    const response = await apiClient.get(`/truck-type/list`, {
      params: {
        ...params,
      },
    });

    let truckTypes = [];
    let hasMore = false;
    console.log('response',response.data.data);
    
    truckTypes = response?.data?.data || [];
    hasMore = response.data?.data?.hasMore || false;

    interface TruckTypeRaw {
      id: string;
      name: string;
      image_url: string;
      parent_truck_id: string | null;
    }

    // Transform to DropdownOption format with nested structure
    const transformToDropdownOptions = (
      types: TruckTypeRaw[]
    ): DropdownOption[] => {
      const parentMap = new Map<string, DropdownOption[]>();
      const parents: DropdownOption[] = [];

      // First pass: create all options
      const optionsMap = new Map<string, DropdownOption>();
      types.forEach((item: TruckTypeRaw) => {
        const option: DropdownOption = {
          value: item.id,
          label: (
            <div className="d-flex align-items-center gap-2">
              <Image
                src={`${item.image_url}`}
                alt={item.name}
                width={24}
                height={24}
                unoptimized
              />
              <span>{item.name}</span>
            </div>
          ),
          name: item.name,
          imageUrl: item.image_url,
          isParent: item.parent_truck_id === null,
        };
        optionsMap.set(item.id, option);
      });

      // Second pass: organize hierarchy
      types.forEach((item: TruckTypeRaw) => {
        const option = optionsMap.get(item.id)!;
        if (item.parent_truck_id === null) {
          parents.push(option);
        } else {
          if (!parentMap.has(item.parent_truck_id)) {
            parentMap.set(item.parent_truck_id, []);
          }
          parentMap.get(item.parent_truck_id)!.push(option);
        }
      });

      // Third pass: attach children to parents
      parents.forEach((parent) => {
        const children = parentMap.get(parent.value as string) || [];
        if (children.length > 0) {
          parent.children = children;
        }
      });

      return parents;
    };

    const transformedData = transformToDropdownOptions(truckTypes);

    return {
      data: transformedData,
      hasMore,
    };
  } catch (error) {
    console.error("Failed to get truck types list:", error);
    return {
      data: [],
      hasMore: false,
    };
  }
};
