import apiClient, { type ApiResponse } from "@lib/api/client";

import type { CreateJobData } from "@/lib/schemas/job.schema";

export interface Job {
  id: string;
  equipmentType: string;
  lineLength?: string;
  volume?: string;
  aggregateTypes?: string[];
  jobDetails?: string[];
  washoutOption?: string[];
  notes?: string;
  onSiteLocation: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  recurringDays?: string[];
  exactTimingRequired: boolean;
  preferredBufferWindow?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const jobService = {
  /**
   * Create a new job
   */
  async createJob(data: CreateJobData): Promise<ApiResponse<Job>> {
    const response = await apiClient.post<ApiResponse<Job>>("/jobs", data);
    return response.data;
  },

  /**
   * Get all jobs
   */
  async getJobs(): Promise<ApiResponse<Job[]>> {
    const response = await apiClient.get<ApiResponse<Job[]>>("/jobs");
    return response.data;
  },

  /**
   * Get a single job by ID
   */
  async getJob(id: string): Promise<ApiResponse<Job>> {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data;
  },

  /**
   * Update a job
   */
  async updateJob(
    id: string,
    data: Partial<CreateJobData>
  ): Promise<ApiResponse<Job>> {
    const response = await apiClient.put<ApiResponse<Job>>(`/jobs/${id}`, data);
    return response.data;
  },

  /**
   * Delete a job
   */
  async deleteJob(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/jobs/${id}`);
    return response.data;
  },
};
