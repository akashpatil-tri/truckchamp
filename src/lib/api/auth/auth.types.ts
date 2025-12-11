export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
