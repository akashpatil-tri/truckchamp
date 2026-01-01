export interface Driver {
  id: string;
  fullName: string;
  name: string;
  initials: string;
  mobile_number: string;

  email: string;
  password: string;
  status: "available" | "unavailable";
  licenseExpiry: string;
  licenseStatus: "valid" | "expired";
  driver_documents: DriverDocuments[];
}

export interface DriverDocuments {
  driver_license?: string;
  white_card?: string;
  voc?: string;
  high_risk_work_license?: string;
}
