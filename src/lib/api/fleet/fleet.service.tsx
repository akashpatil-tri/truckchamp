import axios from "axios";

import apiClient, { ApiResponse } from "@api/client";

import { Attachment } from "@/lib/schemas/fleet.schema";
import type { Fleet, FleetListResponse } from "@/types/fleet.types";

// List fleets with optional search and status filter
export const listFleets = async (
  searchTerm?: string,
  status?: string
): Promise<Fleet[]> => {
  try {
    const params: Record<string, string> = {};
    if (searchTerm?.trim()) {
      params.search = searchTerm;
    }
    if (status && status !== "all") {
      params.status = status;
    }

    const response = await apiClient.get<ApiResponse<FleetListResponse>>(
      "/fleet/list",
      { params }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch fleets");
    }

    return response.data.data?.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch fleets"
      );
    }
    throw error;
  }
};

// Get single fleet by ID
export const getFleet = async (id: string): Promise<Fleet> => {
  try {
    const response = await apiClient.get<ApiResponse<Fleet>>(`/fleet/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch fleet");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch fleet");
    }
    throw error;
  }
};

// Delete fleet
export const deleteFleet = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/fleet/delete/${id}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete fleet");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete fleet"
      );
    }
    throw error;
  }
};

// Update fleet
export const updateFleet = async (
  id: string,
  data: FormData
): Promise<Fleet> => {
  try {
    const response = await apiClient.post<ApiResponse<Fleet>>(
      `/fleet/update/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update fleet");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update fleet"
      );
    }
    throw error;
  }
};

export const addFleet = async (data: {
  truckType: string;
  truckNumber: string;
  hourlyRate: string;
  travelCharge: string;
  minimumHire: string;
  specifications: Record<string, unknown>;
  attachments: Attachment[];
  fleetImages: File[];
  vehicleRegistrationCertificate?: File | null;
  publicLiabilityInsurance?: File | null;
  maintenanceRecords?: File | null;
  truckInsurance?: File | null;
  motorVehicleRegistrationCertificate?: File | null;
  vehicleInsuranceDocument?: File | null;
  swmsDocument?: File | null;
  truckTypeDocuments?: Record<string, File>;
  operatorRequirements?: Record<string, File>;
}): Promise<unknown> => {
  const formData = new FormData();

  // Basic text fields
  formData.append("truckType", data.truckType);
  formData.append("truckNumber", data.truckNumber);
  formData.append("hourlyRate", data.hourlyRate);
  formData.append("travelCharge", data.travelCharge);
  formData.append("minimumHire", data.minimumHire);
  formData.append("specifications", JSON.stringify(data.specifications));
  formData.append("attachments", JSON.stringify(data.attachments));

  // ✅ fleetImages: use exact field name (no [index])
  data.fleetImages.forEach((file) => {
    formData.append("fleetImages", file);
  });

  // ✅ Single document files: use exact field names
  if (data.vehicleRegistrationCertificate) {
    formData.append(
      "vehicleRegistrationCertificate",
      data.vehicleRegistrationCertificate
    );
  }
  if (data.publicLiabilityInsurance) {
    formData.append("publicLiabilityInsurance", data.publicLiabilityInsurance);
  }
  if (data.maintenanceRecords) {
    formData.append("maintenanceRecords", data.maintenanceRecords);
  }
  if (data.truckInsurance) {
    formData.append("truckInsurance", data.truckInsurance);
  }
  if (data.motorVehicleRegistrationCertificate) {
    formData.append(
      "motorVehicleRegistrationCertificate",
      data.motorVehicleRegistrationCertificate
    );
  }
  if (data.vehicleInsuranceDocument) {
    formData.append("vehicleInsuranceDocument", data.vehicleInsuranceDocument);
  }
  if (data.swmsDocument) {
    formData.append("swmsDocument", data.swmsDocument);
  }

  // ✅ Handle truckTypeDocuments: send files + metadata
  if (
    data.truckTypeDocuments &&
    Object.keys(data.truckTypeDocuments).length > 0
  ) {
    const ids = Object.keys(data.truckTypeDocuments);
    const files = Object.values(data.truckTypeDocuments);
    ids.forEach((id) => {
      formData.append("truckTypeDocumentIds", id); // Send each ID (Multer allows repeated fields)
    });
    files.forEach((file) => {
      formData.append("truckTypeDocuments", file);
    });
  }

  // ✅ Handle operatorRequirements: send files + metadata
  if (
    data.operatorRequirements &&
    Object.keys(data.operatorRequirements).length > 0
  ) {
    const reqIds = Object.keys(data.operatorRequirements);
    const reqFiles = Object.values(data.operatorRequirements);
    reqIds.forEach((id) => {
      formData.append("operatorRequirementIds", id);
    });
    reqFiles.forEach((file) => {
      formData.append("operatorRequirements", file);
    });
  }

  const response = await apiClient.post("/fleet/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
