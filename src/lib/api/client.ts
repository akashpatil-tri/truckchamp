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
  withCredentials: true, // Important for cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
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

    // Handle specific status codes
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
