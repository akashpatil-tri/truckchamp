import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  deleteFleet,
  listFleets,
  updateFleet,
} from "@/lib/api/fleet/fleet.service";

export function useFleetsListQuery(searchTerm?: string, status?: string) {
  return useQuery({
    queryKey: ["fleets", searchTerm, status],
    queryFn: () => listFleets(searchTerm, status),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useDeleteFleetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFleet(id),
    onError: (err) => {
      toast.error(err?.message || "Failed to delete fleet");
    },
    onSuccess: () => {
      toast.success("Fleet deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
    },
  });
}

export function useUpdateFleetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateFleet(id, data),
    onError: (err) => {
      toast.error(err?.message || "Failed to update fleet");
    },
    onSuccess: () => {
      toast.success("Fleet updated successfully");
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
    },
  });
}
