import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { profileService } from "@/lib/api/profile/profile.service";
import type {
  UpdateProfilePayload,
  DeleteAccountPayload,
} from "@/lib/api/profile/profile.types";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProfilePayload | FormData;
    }) => profileService.updateProfile(id, data),
    onError: (err) => {
      toast.error(err?.message || "Failed to update profile");
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useDeleteAccountMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DeleteAccountPayload }) =>
      profileService.deleteAccount(id, data),
    onError: (err) => {
      toast.error(err?.message || "Failed to delete account");
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");
      router.push("/login");
    },
  });
}
