export interface ProfileData {
  id: string;
  companyName: string;
  companyType: string;
  companyLogo?: string;
  abnNumber: string;
  primaryContactName: string;
  primaryContactEmail: string;
  mobileNumber: string;
}

export interface UpdateProfilePayload {
  abnNumber?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  mobileNumber?: string;
}

export interface DeleteAccountPayload {
  email: string;
  password: string;
  reason: string;
}
