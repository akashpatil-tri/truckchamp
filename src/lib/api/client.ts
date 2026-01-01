import axios, { AxiosError, AxiosResponse } from "axios";

// API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// API Error type
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  // Important: This ensures cookies are sent with requests
  withCredentials: true,
});

// Request interceptor - no need to manually add token, cookies are sent automatically
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle errors globally
    const apiError: ApiError = {
      message: error.response?.data?.message || "An error occurred",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };

    // Don't auto-redirect on 401 - let AuthProvider handle it
    // This prevents infinite loops on public routes

    return Promise.reject(apiError);
  }
);

export default apiClient;
