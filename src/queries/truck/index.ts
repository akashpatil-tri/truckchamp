import { useQuery } from "@tanstack/react-query";

import { truckService } from "@/lib/api/truck/truck.service";

export function useTruckTypesQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["truckTypes"],
    queryFn: () => truckService.getAllTruckTypes(),
    enabled,
  });
}

export function useTruckPropertiesQuery(
  truckTypeId: string | null,
  enabled?: boolean
) {
  return useQuery({
    queryKey: ["truckProperties", truckTypeId],
    queryFn: () =>
      truckTypeId ? truckService.getTruckProperties(truckTypeId) : [],
    enabled: !!truckTypeId && enabled,
  });
}
