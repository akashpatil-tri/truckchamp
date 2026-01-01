export interface TeamMember {
  id: string;
  name: string;
  fullName: string;
  email: string;
  mobile_number: string;
  initials?: string;
  status?: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}
