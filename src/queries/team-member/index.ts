import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { teamMemberService } from "@/lib/api/team-member/team-member.service";

export function useCreateTeamMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => teamMemberService.create(data),
    onError: (err) => {
      toast.error(err?.message || "Failed to create team member");
    },
    onSuccess: () => {
      toast.success("Team member created successfully");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
}

export function useUpdateTeamMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      teamMemberService.update(id, data),
    onError: (err) => {
      toast.error(err?.message || "Failed to update team member");
    },
    onSuccess: () => {
      toast.success("Team member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
}

export function useTeamMembersListQuery(searchTerm?: string) {
  return useQuery({
    queryKey: ["team-members", searchTerm],
    queryFn: () => teamMemberService.list(searchTerm),
  });
}

export function useDeleteTeamMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamMemberService.delete(id),
    onError: (err) => {
      toast.error(err?.message || "Failed to delete team member");
    },
    onSuccess: () => {
      toast.success("Team member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
}
