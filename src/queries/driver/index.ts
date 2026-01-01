import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  driverService,
  loadDriversList,
} from "@/lib/api/driver/driver.service";

export function useCreateDriverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => driverService.createDriver(data),
    onError: (err) => {
      toast.error(err?.message || "Failed to create driver");
    },
    onSuccess: () => {
      toast.success("Driver created successfully");
      queryClient.invalidateQueries({ queryKey: ["drivers-infinite"] });
    },
  });
}

export function useDriversListQuery() {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: () => driverService.list(),
  });
}

export function useDeleteDriverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => driverService.deleteDriver(id),
    onError: (err) => {
      toast.error(err?.message || "Failed to delete driver");
    },
    onSuccess: () => {
      toast.success("Driver deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["drivers-infinite"] });
    },
  });
}

export function useDriversInfiniteQuery(searchTerm: string = "") {
  return useInfiniteQuery({
    queryKey: ["drivers-infinite", searchTerm],
    queryFn: ({ pageParam = 1 }) => loadDriversList(pageParam, searchTerm),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
