export type UserRole = "construction_admin" | "operator_admin" | "super_admin";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  role: {
    name: string;
    slug: string;
  };
  token: string;
  fullName: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
