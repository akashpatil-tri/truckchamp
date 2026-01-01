import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { jobService } from "@/lib/api/job/job.service";
import type { CreateJobData } from "@/lib/schemas/job.schema";

/**
 * Hook to create a new job
 */
export const useCreateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobData) => jobService.createJob(data),
    onSuccess: (response) => {
      toast.success(response.message || "Job created successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to create job");
    },
  });
};

/**
 * Hook to get all jobs
 */
export const useJobsQuery = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobService.getJobs(),
  });
};

/**
 * Hook to get a single job
 */
export const useJobQuery = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobService.getJob(id),
    enabled: !!id,
  });
};

/**
 * Hook to update a job
 */
export const useUpdateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJobData> }) =>
      jobService.updateJob(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "Job updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", response.data.id] });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update job");
    },
  });
};

/**
 * Hook to delete a job
 */
export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: (response) => {
      toast.success(response.message || "Job deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to delete job");
    },
  });
};
