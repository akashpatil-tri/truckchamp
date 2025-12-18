import apiClient from "@api/client";
import { DropdownOption } from "@common/Dropdown";

// Advanced fetch with pagination - for infinite scroll dropdown
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

    truckTypes = response?.data?.data?.data || [];
    hasMore = response.data?.data?.hasMore || false;

    const transformedData = truckTypes.map(
      (item: { id: string; name: string }) => ({
        value: item.id,
        label: item.name,
      })
    );

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

// Attachment types
export interface Attachment {
  id: string;
  name: string;
  price: number;
}

export interface FleetFormData {
  truckType: string;
  attachments: Attachment[];
  fleetImages: File[];
  truckNumber: string;
  hourlyRate: string;
  travelCharge: string;
  minimumHire: string;
  commonDocuments: {
    vehicleRegistrationCertificate: File | null;
    publicLiabilityInsurance: File | null;
    maintenanceRecords: File | null;
    truckInsurance: File | null;
  };
  motorVehicleCertification: {
    vehicleRegistrationCertificate: File | null;
    vehicleInsuranceDocument: File | null;
    swmsDocument: File | null;
  };
}

// Add fleet API
export const addFleet = async (data: {
  truckType: string;
  truckNumber: string;
  hourlyRate: string;
  travelCharge: string;
  minimumHire: string;
  attachments: Attachment[];
  fleetImages: File[];
  vehicleRegistrationCertificate?: File | null;
  publicLiabilityInsurance?: File | null;
  maintenanceRecords?: File | null;
  truckInsurance?: File | null;
  motorVehicleRegistrationCertificate?: File | null;
  vehicleInsuranceDocument?: File | null;
  swmsDocument?: File | null;
}): Promise<unknown> => {
  const formData = new FormData();

  // Add basic fields
  formData.append("truckType", data.truckType);
  formData.append("truckNumber", data.truckNumber);
  formData.append("hourlyRate", data.hourlyRate);
  formData.append("travelCharge", data.travelCharge);
  formData.append("minimumHire", data.minimumHire);

  // Add attachments as JSON string
  formData.append("attachments", JSON.stringify(data.attachments));

  // Add fleet images
  data.fleetImages.forEach((file, index) => {
    formData.append(`fleetImages[${index}]`, file);
  });

  // Add common documents if present
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

  // Add motor vehicle certification documents if present
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

  const response = await apiClient.post("/fleet/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
