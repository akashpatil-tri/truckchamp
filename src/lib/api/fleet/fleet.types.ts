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
